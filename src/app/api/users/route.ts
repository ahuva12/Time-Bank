import { connectDatabase, getAllDocuments, insertDocument } from "@/services/mongo";
import { NextResponse } from "next/server";
import { User } from "@/types/user";
import { userSchema } from "@/validations/validationsServer/user";
import { z } from "zod";

export async function GET(request: Request) {
    try {
        const client = await connectDatabase();
        const data = await getAllDocuments(client, 'users');

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body: User = await req.json();

        const validatedUser = userSchema.parse(body);
        const client = await connectDatabase();
        const res = await insertDocument(client, 'users', body);

        return NextResponse.json({ _id: res._id }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Error post request:", error);
        return NextResponse.json({ error: "Failed to insert user" }, { status: 500 });
    }
}
