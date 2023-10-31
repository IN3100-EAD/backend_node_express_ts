import mongoose from "mongoose";
import { Request } from "express";
import { IUser } from "../models/userModel";

interface IModifiedRequest extends Request {
  user?: mongoose.Document<IUser>;
}

export { IModifiedRequest };
