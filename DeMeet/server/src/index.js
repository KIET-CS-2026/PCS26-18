import connectDB from "./db/index.js";
import app from "./app.js";
import { config } from "./config/index.js";
import logger from "./utils/logger.js";

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed:", err);
  });
