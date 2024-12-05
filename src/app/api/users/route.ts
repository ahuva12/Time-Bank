import { connectDatabase, getAllDocuments } from "@/services/mongo";
import { NextResponse } from "next/server";

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


