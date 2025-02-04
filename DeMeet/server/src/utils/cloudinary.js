import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "./logger.js";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //uplaoding on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    logger.info("File Uploaded Succesfully!");
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    logger.error("Faced Error while uploading the file");
    fs.unlinkSync(localFilePath); //remove locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadToCloudinary };
