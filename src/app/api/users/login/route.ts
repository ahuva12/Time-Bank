import { connectDatabase, getAllDocuments, insertDocument, getDocument } from "@/services/mongo";
import { NextResponse } from "next/server";
import { loginSchema } from "@/validations/userSchema";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    loginSchema.parse({ email, password });

    const client = await connectDatabase();
    const user = await getDocument(client, 'users', { email, password });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {   
    if (error instanceof z.ZodError) {
        return NextResponse.json(
            { error: "Validation failed", details: error.errors },
            { status: 400 }
        );
    }
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

