import { connectDatabase, getDocuments } from "@/services/mongo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json(); 
        const client = await connectDatabase();
        const user = await getDocuments(client, 'users', {
           email: body.email
        });
        return NextResponse.json(user);

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}