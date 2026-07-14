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
    return uri;
  }

  // Local dev — try local MongoDB with short timeout, fallback to in-memory
  const timeout = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), 2000)
  );
  const connectLocal = mongoose.createConnection("mongodb://localhost:27017/easyshop", {
    serverSelectionTimeoutMS: 2000,
  }).asPromise().then((conn) => {
    conn.close();
    return "mongodb://localhost:27017/easyshop";
  });

  try {
    return await Promise.race([connectLocal, timeout]);
  } catch {
    // In-memory fallback
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const dbPath = path.resolve(process.cwd(), ".mongodb-data");
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }
    const mongod = await MongoMemoryServer.create({
      instance: { dbName: "easyshop", dbPath, storageEngine: "wiredTiger" },
    });
    memoryServer = mongod;
    return mongod.getUri();
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
