import { connectDatabase, getAllDocuments, insertDocument } from "@/services/mongo";
import { NextResponse } from "next/server";
import { User } from "@/types/user";
import { activitySchema } from "@/validations/activitySchema";
import { z } from "zod";

export async function GET(request: Request) {
    try {
        const client = await connectDatabase();
        const data = await getAllDocuments(client, 'activities');

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { message: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body: User = await req.json();

        const validatedActivity = activitySchema.parse(body);
        const client = await connectDatabase();
        const res = await insertDocument(client, 'activities', body);

        return NextResponse.json({ _id: res._id }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Error post request:", error);
        return NextResponse.json({ error: "Failed to insert activity" }, { status: 500 });
    }
}