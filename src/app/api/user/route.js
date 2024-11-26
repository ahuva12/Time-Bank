import { connectDatabase, getDocument } from "../../../services/mongo";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const db = await connectDatabase();
      
      const user = await getDocument(client, 'users', { _id: decoded.userId });

      //const user = await usersCollection.findOne({ _id: decoded.userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
