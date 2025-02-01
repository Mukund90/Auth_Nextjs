import mongoose from "mongoose";
export default async function connectMongo(): Promise<void> {
  try {

    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
