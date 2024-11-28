import { connectDatabase, deleteDocument, updateDocument } from '@/services/mongo';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { User } from '@/types/user';
import { userSchema } from "@/validations/user";
import { z } from "zod";

export async function DELETE(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await params;
        if (!userId) {
            return NextResponse.json({ message: "user ID is required" }, { status: 400 });
        }

        const client = await connectDatabase();
        const result = await deleteDocument(client, 'users', { _id: new ObjectId(userId) });

        if (result.deletedCount === 1) {
            return NextResponse.json({ message: "User deleted successfully" }, {status: 200});
        } else {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await params;
        const body: User = await req.json(); 

        if (!userId) {
            return NextResponse.json({ message: "user ID is required" }, { status: 400 });
        }
        const validatedUser = userSchema.parse(body);

        const { _id, ...updateFields } = body;

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: "No fields to update" }, { status: 400 });
        }

        const client = await connectDatabase();
        const result = await updateDocument(client, 'users', { _id: new ObjectId(userId) }, updateFields);

        if (result.modifiedCount === 1) { 
            return NextResponse.json({ message: "User updated successfully" }, {status: 200});
        } else {
            if (result.matchedCount === 1)
                return NextResponse.json({ message: "No changes made" }, { status: 204 });
            else
                return NextResponse.json({ message: "User not found" }, { status: 404 });
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
