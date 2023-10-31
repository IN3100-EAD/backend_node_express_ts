import express, {
  NextFunction,
  Request,
  Response,
} from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";

import globalErrorController from "./controllers/errorController";
import router from "./router";
import AppError from "./utils/appError";

dotenv.config({
  path: path.resolve(__dirname, "..", ".env.local"),
});

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

//? Development logging
if (process.env.NODE_ENV?.trim() === "development") {
  app.use(morgan("dev"));
}

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const SERVER_PORT = process.env.PORT || 8080;

server.listen(SERVER_PORT, () => {
  console.log(
    `Server running on http://localhost:${SERVER_PORT}`
  );
});

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.Promise = Promise;
if (MONGODB_URL) {
  mongoose.connect(MONGODB_URL);
} else {
  console.error("MONGODB_URL is not defined");
}

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Database");
});
mongoose.connection.on("error", (err: Error) => {
  console.error(err);
});

// ROUTE HANDLING
console.log("Working until Router");
app.use("/", router());

// HANDLE UNHANDLED ROUTES
app.all(
  "*",
  (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError(
        `Can't find ${req.originalUrl} on this server!`,
        404
      )
    );
  }
);

// GLOBAL ERROR HANDLING
app.use(globalErrorController);
