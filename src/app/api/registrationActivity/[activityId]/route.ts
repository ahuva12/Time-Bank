import { connectDatabase, updateDocuments, updateDocument, getDocument } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId, ClientSession } from 'mongodb';

export async function PATCH(req: Request, { params }: { params: { activityId: string } }) {
    try {
        const { activityId } = params;
        if (!activityId) {
            return NextResponse.json({ message: "Activity ID is required" }, { status: 400 });
        }

        const { status, giverId, receiverId } = await req.json();
        if (!giverId || !receiverId) {
            return NextResponse.json({ message: "Giver ID and receiver ID are required" }, { status: 400 });
        }

        if (status !== 'caughted' && status !== 'proposed') {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        const giverIdObjId = new ObjectId(giverId);
        const receiverIdObjId = new ObjectId(receiverId);
        const activityIdObjId = new ObjectId(activityId);

        if (status === 'caughted')
            return await registrationForActivity(activityIdObjId, giverIdObjId, receiverIdObjId);
        else 
            return await unregisterForActivity(activityIdObjId, giverIdObjId, receiverIdObjId);

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

const registrationForActivity = async (activityId:ObjectId, giverId:ObjectId, receiverId:ObjectId) => {
    let session: ClientSession | undefined;
    try {
        const client = await connectDatabase();
        session = client.startSession();
        session.startTransaction();

        const activity = await getDocument(client, 'activities', {_id: activityId})

        if (activity === null) {
            await session.abortTransaction();
            return NextResponse.json({ message: "The activity not found, transaction aborted" }, { status: 400 });
        }

        if (!activity.giverId.equals(giverId) || activity.receiverId !== null) {
            await session.abortTransaction();
            return NextResponse.json({ message: "The activity does not belong to these users, transaction aborted" }, { status: 400 });
        }
        if (activity.status !== 'proposed') {
            await session.abortTransaction();
            return NextResponse.json({ message: 'The activity is not in "proposed" status.' }, { status: 400 });
        }
      
        const filter = {
            _id: { $in: [giverId, receiverId] },  
            $or: [
                { _id: receiverId, remainingHours: { $gte: activity.durationHours } },
                { _id: giverId }, 
            ],
        };

        const updateRemainingHours = [
            {
                $set: {
                    remainingHours: {
                        $cond: {
                            if: { $eq: ["$_id", giverId] },
                            then: { $add: ["$remainingHours", activity.durationHours] },
                            else: { $subtract: ["$remainingHours", activity.durationHours] },
                        },
                    },
                },
            },
        ];
        
        const updateResult = await updateDocuments(client, 'users', filter, updateRemainingHours, session);

        if (updateResult.modifiedCount !== 2) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Updating remainingHours failed, transaction aborted" }, { status: 400 });
        }

        // Update the activity status
        const updateActivity = {
            status: 'caughted',
            receiverId,
        };

        const updateStatusResult = await updateDocument(
            client, 'activities', { _id: activityId }, updateActivity, session
        );

        if (updateStatusResult.modifiedCount !== 1) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Updating activity failed, transaction aborted" }, { status: 400 });
        }

        await session.commitTransaction();
        return NextResponse.json({ message: "RemainingHours and activity status updated - the user has successfully registered for the activity." }, { status: 200 });

    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

const unregisterForActivity = async (activityId:ObjectId, giverId:ObjectId, receiverId:ObjectId) => {
    let session: ClientSession | undefined;
    try {
        const client = await connectDatabase();
        session = client.startSession();
        session.startTransaction();

        const activity = await getDocument(client, 'activities', {_id: activityId})

        if (activity === null) {
            await session.abortTransaction();
            return NextResponse.json({ message: "The activity not found, transaction aborted" }, { status: 400 });
        }

        if (!activity.giverId.equals(giverId) || activity.receiverId === null || !activity.receiverId.equals(receiverId)) {
            await session.abortTransaction();
            return NextResponse.json({ message: "The activity does not belong to these users, transaction aborted" }, { status: 400 });
        }
        if (activity.status !== 'caughted') {
            await session.abortTransaction();
            return NextResponse.json({ message: 'The activity is not in "caughted" status.' }, { status: 400 });
        }

        const filter = {
            _id: { $in: [giverId, receiverId] },  
            $or: [
                { _id: giverId, remainingHours: { $gte: activity.durationHours } },
                { _id: receiverId }, 
            ],
        };
        
        const updateRemainingHours = [
            {
                $set: {
                    remainingHours: {
                        $cond: {
                            if: { $eq: ["$_id", receiverId] },
                            then: { $add: ["$remainingHours", activity.durationHours] },
                            else: { $subtract: ["$remainingHours", activity.durationHours] },
                        },
                    },
                },
            },
        ];

        // console.log(filter)
        // console.log(updateRemainingHours)
        
        const updateResult = await updateDocuments(client, 'users', filter, updateRemainingHours, session);
        console.log(updateResult)

        if (updateResult.modifiedCount !== 2) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Updating remainingHours failed, transaction aborted" }, { status: 400 });
        }

        // Update the activity status
        const updateActivity = {
            status: 'proposed',
            receiverId: null,
        };

        const updateStatusResult = await updateDocument(
            client, 'activities', { _id: activityId }, updateActivity, session
        );

        if (updateStatusResult.modifiedCount !== 1) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Updating activity failed, transaction aborted" }, { status: 400 });
        }

        await session.commitTransaction();
        return NextResponse.json({ message: "RemainingHours and activity status updated - the user has successfully unsubscribed from the activity." }, { status: 200 });

    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

