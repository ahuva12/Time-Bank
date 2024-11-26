import { connectDatabase, getDocument } from "@/services/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req)  {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return new Response(
            JSON.stringify({ message: "Username and password are required" }),
            { status: 400 }
          );
    }
    // console.log('1')
    try {
      const client = await connectDatabase();
    //   console.log('2')
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
      
       // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        return new Response(
          JSON.stringify({ message: "Server configuration error" }),
          { status: 500 }
        );
      }
  
      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return new Response(
        JSON.stringify({token }),
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
