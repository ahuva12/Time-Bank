import { connectDatabase, incFieldInDocument, getDocument } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PATCH(req: Request, { params }: { params: Promise<{ giverId: string, receiverId: string }> }) {
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

        const receiver = await getDocument(client, 'users', { _id: new ObjectId(receiverId) });
        if (!receiver) {
            return NextResponse.json({ message: "The receiver not found" }, { status: 404 });
        }

        if (receiver.remainingHours < durationHoursActivity) {
            return NextResponse.json({ message: "The receiver does not have enough remainingHours" }, { status: 400 });
        }

        const giver = await getDocument(client, 'users', { _id: new ObjectId(giverId) });
        if (!giver) {
            return NextResponse.json({ message: "The giver not found" }, { status: 404 });
        }

        const updateGiver = {
            $inc: { remainingHours: durationHoursActivity }
        };
        const updateReceiver = {
            $inc: { remainingHours: -durationHoursActivity }
        };

        // Update the giver's remainingHours
        const giverResult = await incFieldInDocument(client, 'users', { _id: new ObjectId(giverId) }, updateGiver);
        if (giverResult.modifiedCount === 0) {
            return NextResponse.json({ message: "No changes made" }, { status: 204 });
        }

        // Update the receiver's remainingHours
        const receiverResult = await incFieldInDocument(client, 'users', { _id: new ObjectId(receiverId) }, updateReceiver);
        if (receiverResult.modifiedCount === 0) {
            return NextResponse.json({ message: "No changes made" }, { status: 204 });
        }

        return NextResponse.json({ message: "RemainingHours updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}