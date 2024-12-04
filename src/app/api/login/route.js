import { connectDatabase, getDocument } from "@/services/mongo";
import bcrypt from "bcryptjs";

export async function POST(req)  {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return new Response(
            JSON.stringify({ message: "Username and password are required" }),
            { status: 400 }
          );
    }
    
    try {
      const client = await connectDatabase();
    
      // Check if the username already exists
      const user = await getDocument(client, 'users',{ 'email': email});
    
      if (!user) {
        return new Response(
            JSON.stringify({ message: "Invalid credentials" }),
            { status: 400 }
          );
      }

      // Compare password with stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return new Response(
            JSON.stringify({ message: "Invalid credentials" }),
            { status: 400 }
          );
      }

      return new Response(
        JSON.stringify({ user }),
        { status: 200 }
      );
      
    } catch (error) {
        console.error("Error in POST /login:", error);
        return new Response(
          JSON.stringify({ message: "Error logging in" }),
          { status: 500 }
        );
    }
  
}
