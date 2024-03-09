import mongoose from "mongoose";
import { config } from "dotenv";
config();
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error(err);
  }
};

export const connectTestDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URI}_test`);
  } catch (err) {
    console.error(err);
  }
};
