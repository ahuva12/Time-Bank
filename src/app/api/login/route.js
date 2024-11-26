import { connectDatabase, getDocument } from "../../../services/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    try {
      const db = await connectDatabase();
      const client = await connectDatabase();

      // Check if the username already exists
      const user = await getDocument(client, 'users',{ 'email': email});
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare password with stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
