import { MongoClient, ObjectId } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

export async function connectDatabase() {
    if (!client) {
        const dbConnectionString = process.env.PUBLIC_DB_CONNECTION;
        if (!dbConnectionString) {
            throw new Error('Database connection string is not defined');
        }
        try {
            client = new MongoClient(dbConnectionString);
            clientPromise = client.connect();
        } catch (error) {
            console.error("Failed to connect to the database:", error);
            throw error; 
        }
    }
    return clientPromise;
}

export async function getAllDocuments(client: any, collection: string) {
    try {
        const db = client.db('time-bank');
        const documents = await db.collection(collection).find().toArray();
        return documents;
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
}

export async function insertDocument(client: any, collection: string, document: object) {
    try {
        const db = client.db('time-bank');
        const result = await db.collection(collection).insertOne(document);
        return { _id: result.insertedId };
    } catch (error) {
        console.error("Error inserting document:", error);
        throw error;
    }
}

export async function deleteDocument(client: any, collection: string, filter: object) {
    try {
        const db = client.db('time-bank');
        const result = await db.collection(collection).deleteOne(filter);
        return result;
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}

export async function updateDocument(client: any, collection: string, filter: object, update: object) {
    try {
        const db = client.db('time-bank');
        const result = await db.collection(collection).updateOne(filter, { $set: update });
        return result;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}









 