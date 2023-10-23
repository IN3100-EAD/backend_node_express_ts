import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "..", ".env.local"),
});

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

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
mongoose.connect(MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Database");
});
mongoose.connection.on("error", (err: Error) => {
  console.error(err);
});
