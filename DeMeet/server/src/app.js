import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "./utils/logger.js";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware.js";
import { config } from "./config/index.js";
import passport from "./config/passport.js";

const app = express();

app.use(cors(config.cors));

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

// Session configuration for passport
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.environment === 'prod',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//routes import
import userRouter from "./routes/user.routes.js";
import healthRouter from "./routes/health.routes.js";

//routes declaration
app.use("/api/health", healthRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);
export default app;
