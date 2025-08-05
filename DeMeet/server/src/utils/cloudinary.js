import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "./logger.js";
import { config } from "../config/index.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    logger.info("File uploaded successfully to Cloudinary");
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    logger.error("Error uploading file to Cloudinary:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadToCloudinary };
