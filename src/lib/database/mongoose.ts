import mongoose from "mongoose";
import fs from "fs";
import path from "path";

function getEnvURI(): string | undefined {
  return process.env.MONGODB_URI;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let memoryServer: unknown = null;

async function getMongoURI(): Promise<string> {
  const uri = getEnvURI();
  if (uri && uri !== "mongodb://localhost:27017/easyshop") {
    console.log("[MongoDB] Using configured URI (Atlas):", uri.slice(0, uri.indexOf("@") + 1) + "***");
    return uri;
  }

  // Try local MongoDB first
  try {
    const conn = await mongoose.createConnection("mongodb://localhost:27017/easyshop").asPromise();
    await conn.close();
    console.log("[MongoDB] Using local MongoDB");
    return "mongodb://localhost:27017/easyshop";
  } catch {
    // Local MongoDB not available, use in-memory server with disk persistence
    console.log("[MongoDB] Local MongoDB unavailable, starting in-memory server...");
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const dbPath = path.resolve(process.cwd(), ".mongodb-data");
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbName: "easyshop",
        dbPath,
        storageEngine: "wiredTiger",
      },
    });
    memoryServer = mongod;
    const mUri = mongod.getUri();
    console.log("[MongoDB] Using in-memory server at:", mUri);
    return mUri;
  }
}

export async function stopMongoDB() {
  if (memoryServer) {
    const mongod = memoryServer as { stop: () => Promise<void> };
    await mongod.stop();
    memoryServer = null;
  }
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = await getMongoURI();
    cached.promise = mongoose.connect(uri, {
      bufferCommands: true,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
