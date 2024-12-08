import { connectDatabase, updateDocument } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { updatingStatusSchema } from '@/validations/validationsServer/activity';
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: Promise<{ activityId: string }> }) {
    try {
        const { activityId } = await params;
        if (!activityId) {
            return NextResponse.json({ message: "Activity ID is required" }, { status: 400 });
        }

        const body = await req.json(); 
        const validatedUpdatedStatus = updatingStatusSchema.parse(body);

        const { receiverId, ...rest } = validatedUpdatedStatus;
        const updateData = {
            ...rest,
            receiverId: new ObjectId(receiverId),
        };

        const client = await connectDatabase();
        const result = await updateDocument(client, 'activities', { _id: new ObjectId(activityId) }, updateData);

        if (result.modifiedCount === 1) { 
            return NextResponse.json({ message: "Activity updated successfully" }, {status: 200});
        } else {
            if (result.matchedCount === 1)
                return NextResponse.json({ message: "No changes made" }, { status: 204 });
            else
                return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}