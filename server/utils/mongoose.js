import mongoose from "mongoose";
import { useRuntimeConfig } from "#imports";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected ✅ ✅ ✅ ");
  } catch (err) {
    console.error("MongoDB connection error: ❌ ❌ ❌ ❌ ❌ ❌ ", err);
  }
}
