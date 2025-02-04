import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json({ limit: "50kb" }));

app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use(express.static("public"));

app.use(cookieParser());

//routes import

import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/users", userRouter);

app.use(errorHandler);
export default app;
