import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";

import {
  IUser,
  UserModel,
  TypedUser,
} from "../models/userModel";

import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

interface IModifiedRequest extends Request {
  user?: TypedUser;
}

export const getAllUsers = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const users = await UserModel.find();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  }
);

export const getUserById = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const user: TypedUser | null = await UserModel.findById(
      req.params.id
    );

    if (!user) {
      return next(
        new AppError("No user found with that ID", 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);
