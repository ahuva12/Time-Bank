import { connectDatabase, updateDocuments  } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId, ClientSession } from 'mongodb';

export async function PATCH(req: Request, { params }: { params: Promise<{ giverId: string, receiverId: string }> }) {
    let session;

    try {
        const { giverId, receiverId } = await params;
        if (!giverId || !receiverId) {
            return NextResponse.json({ message: "giver ID and receiver ID are required" }, { status: 400 });
        }

        const { durationHoursActivity } = await req.json();
        if (typeof durationHoursActivity !== 'number' || durationHoursActivity <= 0) {
            return NextResponse.json({ message: "Invalid hoursActivity value" }, { status: 400 });
        }

        const client = await connectDatabase();
        session = client.startSession();
        session.startTransaction();

        const filter = {
            $or: [
                { _id: new ObjectId(receiverId), remainingHours: { $gte: durationHoursActivity } },
                { _id: new ObjectId(giverId) },
            ],
        };

        const update = [
            {
                $set: {
                    remainingHours: {
                        $cond: {
                            if: { $eq: ["$_id", new ObjectId(giverId)] },
                            then: { $add: ["$remainingHours", durationHoursActivity] },
                            else: { $subtract: ["$remainingHours", durationHoursActivity] },
                        },
                    },
                },
            },
        ];

        const updateResult = await updateDocuments(client, 'users', filter, update, session);

        if (updateResult.matchedCount !== 2 || updateResult.modifiedCount !== 2) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Updating remainingHours failed, transaction aborted" }, { status: 400 });
        }

        await session.commitTransaction();

        return NextResponse.json({ message: "RemainingHours updated successfully" }, { status: 200 });
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