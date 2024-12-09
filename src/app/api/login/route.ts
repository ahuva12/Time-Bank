import { connectDatabase, getDocument } from "@/services/mongo";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/validations/validationsServer/user";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req:Request)  {
    
    try {
      const { email, password } = await req.json();

      loginSchema.parse({ email, password });

      const client = await connectDatabase();
    
      // bring the user from the database
      const user = await getDocument(client, 'users',{ 'email': email});
    
      if (!user) {
        return NextResponse.json(
          { error: "The user not found"},
          { status: 400 }
        );
      }

      // Compare password with stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { error: "The password is uncorrect"},
          { status: 400 }
        );
      }

      return NextResponse.json(
        { user },
        { status: 200 }
      );
      
    } catch (error) {
        console.error("Error in POST /login:", error);
        if (error instanceof z.ZodError) {
          return NextResponse.json(
              { error: "Validation failed", details: error.errors },
              { status: 400 }
          );
      }
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

