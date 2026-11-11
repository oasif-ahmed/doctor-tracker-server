
import { MongoClient, Db } from "mongodb";
import config from "../config";

const uri = config.database_url;

if (!uri) {
  throw new Error("MONGODB_URL is not defined in your .env file");
}

const DB_NAME = "doctor-tracker";

let client: MongoClient;
let db: Db;

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse the connection during Next.js hot reload
  const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectDB(): Promise<Db> {
  try {
    const connectedClient = await clientPromise;

    db = connectedClient.db(DB_NAME);

    console.log("✅ MongoDB Connected Successfully!");

    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    throw error;
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }

  return db;
}

export async function closeDB(): Promise<void> {
  if (clientPromise) {
    const connectedClient = await clientPromise;
    await connectedClient.close();

    db = undefined as unknown as Db;

    console.log("🔌 MongoDB Disconnected");
  }
}
