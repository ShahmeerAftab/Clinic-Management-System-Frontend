// Mongoose connection — server-only, reused across hot-reloads

import mongoose from "mongoose";

declare global {
  var _mongooseConnectPromise: Promise<typeof mongoose> | undefined;
}

export const connectdb = async () => {
  if (mongoose.connection.readyState === 1) return; // already connected

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in .env.local");

  if (!global._mongooseConnectPromise) {
    global._mongooseConnectPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 20000,
    });
  }

  await global._mongooseConnectPromise;
};

export default connectdb;
