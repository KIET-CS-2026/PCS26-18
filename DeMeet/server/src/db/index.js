import mongoose from "mongoose";
import { config } from "../config/index.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.database.uri}/${config.database.name}`
    );
    logger.info(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    logger.error("MongoDB Connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
