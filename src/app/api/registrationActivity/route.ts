import { connectDatabase, updateDocuments, updateDocument } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId, ClientSession } from 'mongodb';

export async function GET(req: Request, { params }: { params: Promise<{ activityId: string }> }) {
    //add checking that the activity it for these users
    let session: ClientSession | undefined;

    try {
        const { activityId } = await params;
        if (!activityId) {
            return NextResponse.json({ message: "activity ID is required" }, { status: 400 });
        }

        const { durationHoursActivity, status, giverHoursId, receiverHoursId  } = await req.json();
        if (!giverHoursId || !receiverHoursId)  {
            return NextResponse.json({ message: "giver ID and receiver ID are required" }, { status: 400 });
        }
        if (typeof durationHoursActivity !== 'number' || durationHoursActivity <= 0) {
            return NextResponse.json({ message: "Invalid hoursActivity value" }, { status: 400 });
        }
        if (status !== 'accepted' || status !== 'proposed') {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        const client = await connectDatabase();
        session = client.startSession();
        session.startTransaction();

        const filter = {
            $or: [
                { _id: new ObjectId(giverHoursId), remainingHours: { $gte: durationHoursActivity } },
                { _id: new ObjectId(receiverHoursId) },
            ],
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

        const updateStatusActivity = {
            status,
            receiverId: new ObjectId(giverHoursId),
        };

        const updateResult = await updateDocuments(client, 'users', filter, updateRemainingHours, session);

        if (updateResult.matchedCount !== 2 || updateResult.modifiedCount !== 2) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Updating remainingHours failed, transaction aborted" }, { status: 400 });
        }

        const result = await updateDocument(client, 'activities', { _id: new ObjectId(activityId) }, updateStatusActivity, session);

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