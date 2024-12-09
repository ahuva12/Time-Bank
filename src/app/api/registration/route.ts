import { connectDatabase, updateDocuments, updateDocument } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId, ClientSession, MongoClient } from 'mongodb';

export async function PATCH(req: Request, { params }: { params: Promise<{ giverHoursId: string, receiverHoursId: string, activityId: string }> }) {
    let session: ClientSession | undefined;

    try {
        const { giverHoursId, receiverHoursId, activityId } = await params;
        if (!giverHoursId || !receiverHoursId || !activityId) {
            return NextResponse.json({ message: "giver ID, receiver ID, and activity ID are required" }, { status: 400 });
        }

        const { durationHoursActivity, status } = await req.json();
        if (typeof durationHoursActivity !== 'number' || durationHoursActivity <= 0) {
            return NextResponse.json({ message: "Invalid hoursActivity value" }, { status: 400 });
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
