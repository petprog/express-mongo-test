import { config } from "dotenv";
config();
import { connectDB } from "./configs/dbCon.mjs";
import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

connectDB();

const app = createApp();

const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to Database");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
