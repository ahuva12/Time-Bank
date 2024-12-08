import { connectDatabase, updateDocuments, updateDocument, getDocument } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId, ClientSession } from 'mongodb';

export async function PATCH(req: Request, { params }: { params: { activityId: string } }) {
    //add check 
    let session: ClientSession | undefined;

    try {
        const { activityId } = params;
        if (!activityId) {
            return NextResponse.json({ message: "Activity ID is required" }, { status: 400 });
        }

        const { durationHoursActivity, status, giverHoursId, receiverHoursId } = await req.json();
        if (!giverHoursId || !receiverHoursId) {
            return NextResponse.json({ message: "Giver ID and receiver ID are required" }, { status: 400 });
        }

        if (typeof durationHoursActivity !== 'number' || durationHoursActivity <= 0) {
            return NextResponse.json({ message: "Invalid hoursActivity value" }, { status: 400 });
        }

        if (status !== 'caughted' && status !== 'proposed') {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        const client = await connectDatabase();
        session = client.startSession();
        session.startTransaction();

        const activity = await getDocument(client, 'activities', {_id: new ObjectId(activityId)})

        console.log(activity)
        

        const filter = {
            _id: { $in: [new ObjectId(giverHoursId), new ObjectId(receiverHoursId)] },
        };

        const updateRemainingHours = [
            {
                $set: {
                    remainingHours: {
                        $cond: {
                            if: { $eq: ["$_id", new ObjectId(receiverHoursId)] },
                            then: { $add: ["$remainingHours", durationHoursActivity] },
                            else: { $subtract: ["$remainingHours", durationHoursActivity] },
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
            status,
            receiverId: new ObjectId(giverHoursId),
        };

        const result = await updateDocument(
            client,
            'activities',
            { _id: new ObjectId(activityId) },
            updateActivity,
            session
        );

        if (result.modifiedCount !== 1) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Updating activity failed, transaction aborted" }, { status: 400 });
        }

        await session.commitTransaction();
        return NextResponse.json({ message: "RemainingHours and activity status updated successfully" }, { status: 200 });

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
