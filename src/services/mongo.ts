import { MongoClient, ClientSession } from "mongodb";

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

export async function getAllDocuments(client: MongoClient, collection: string) {
    try {
        const db = client.db('time-bank');
        const documents = await db.collection(collection).find().toArray();
        return documents;
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
}

export async function getDocuments(client: MongoClient, collection: string, filter: object) {
    try {
        const db = client.db('time-bank');
        const documents = await db.collection(collection).find(filter).toArray();
        return documents;

    } catch (error) {
        console.error("Error retrieving documents:", error);
        throw error;
    }
}

export async function getDocument(client: MongoClient, collection: string, filter: object) {
    try {
        const db = client.db('time-bank');
        const document = await db.collection(collection).findOne(filter);
        return document;

    } catch (error) {
        console.error("Error retrieving document:", error);
        throw error;
    }
}

export async function insertDocument(client: MongoClient, collection: string, document: object) {
    try {
        const db = client.db('time-bank');
        const result = await db.collection(collection).insertOne(document);
        return { _id: result.insertedId };
    } catch (error) {
        console.error("Error inserting document:", error);
        throw error;
    }
}

export async function deleteDocument(client: MongoClient, collection: string, filter: object) {
    try {
        const db = client.db('time-bank');
        const result = await db.collection(collection).deleteOne(filter);
        return result;

    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}

export async function updateDocument(client: MongoClient, collection: string, filter: object, update: object, session?: ClientSession) {
    try {
        const db = client.db('time-bank');
        const result = await db.collection(collection).updateOne(filter, { $set: update }, { session });
        return result;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

export async function updateDocuments(client: MongoClient, collection: string, filter: object, update: object, session?: ClientSession) {
    try {
        const db = client.db('time-bank');
        const result = await db.collection(collection).updateMany(filter, update, { session });

        return result;
    } catch (error) {
        console.error("Error updating multiple documents:", error);
        throw error;
    }
}
 








 