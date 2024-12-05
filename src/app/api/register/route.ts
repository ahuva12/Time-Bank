import { connectDatabase, insertDocument, getDocument } from "@/services/mongo";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { userSchema } from "@/validations/validationsServer/user";
import { z } from "zod";


export async function POST(req:Request)  {

    try {
      const body = await req.json();
      const validatedUser = userSchema.parse(body);

      const client = await connectDatabase();
      
      // Check if the username already exists
      const existingUser = await getDocument(client, 'users',{ 'email': body.email}); 
      
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists." },
          { status: 409 }
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(body.password, 12);
      const res = await insertDocument(client, 'users', {...body, password: hashedPassword, remainingHours: 2});

      return NextResponse.json({message: "User registered successfully.",  _id: res._id }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
              { error: "Validation failed", details: error.errors },
              { status: 400 }
          );
      }
      return NextResponse.json({ error: "Failed to insert user" }, { status: 500 });
    }
  
}
