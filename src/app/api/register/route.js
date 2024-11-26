import { connectDatabase, insertDocument, getDocument } from "../../../services/mongo";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const client = await connectDatabase();

      // Check if the username already exists
      const existingUser = await getDocument(client, 'users',{ 'email': email}); //await usersCollection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      await insertDocument(client, 'users', {
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
