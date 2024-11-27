import { connectDatabase, insertDocument, getDocument } from "@/services/mongo";
import bcrypt from "bcryptjs";

export async function POST(req)  {
    
    const body = await req.json();

    const { firstName, lastName, address, gender, email, phoneNumber, birthDate, password } = body;

    if (!firstName || !lastName || !address || !gender || !email || !phoneNumber || !birthDate || !password) {
        return new Response(
            JSON.stringify({ message: "All fields are required." }),
            { status: 400 }
          );
    }
    try {
      const client = await connectDatabase();
      
      // Check if the username already exists
      const existingUser = await getDocument(client, 'users',{ 'email': email}); //await usersCollection.findOne({ username });
      
      if (existingUser) {
        return new Response(
            JSON.stringify({ message: "User already exists." }),
            { status: 409 }
          );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      await insertDocument(client, 'users', {
        firstName: firstName, 
        lastName: lastName, 
        address: address, 
        gender: gender, 
        email: email, 
        phoneNumber: phoneNumber, 
        dateOfBirth: birthDate,
        password: hashedPassword,
        remainingHours: 0
      });

      return new Response(
        JSON.stringify({ message: "User registered successfully." }),
        { status: 201 }
      );
    } catch (error) {
        console.error("Error in POST /register:", error);
        return new Response(
          JSON.stringify({ message: "An error occurred." }),
          { status: 500 }
        );
    }
  
}
