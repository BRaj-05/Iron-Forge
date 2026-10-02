import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || "";

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI or DATABASE_URL in your environment");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, uri: null };
}

function getMongoHost(uri: string) {
  return uri
    .replace(/^mongodb(\+srv)?:\/\/(?:[^@]+@)?/, "")
    .split(/[/?]/)[0];
}

export default async function connectMongo() {
  if (cached?.conn && cached.uri === MONGO_URI) return cached.conn;

  if (cached?.uri && cached.uri !== MONGO_URI) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached?.promise) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DB] Mongo host: ${getMongoHost(MONGO_URI)}`);
    }

    cached!.uri = MONGO_URI;
    cached!.promise = mongoose.connect(MONGO_URI);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
