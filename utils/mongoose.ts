// @ts-ignore
import mongoose from "mongoose";

let isConnected: boolean = false;

export const dbConnect = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("MISSING MONGODB_URL");
  }

  if (isConnected) {
    console.log("MongoDB is already connected");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "pinoyoverflow",
    });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};