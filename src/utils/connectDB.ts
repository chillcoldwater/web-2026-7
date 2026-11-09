import mongoose from "mongoose";
import { exit } from "node:process";
import { stringify } from "node:querystring";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-app");
    console.log("connected mongoDB");
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
