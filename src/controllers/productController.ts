import { NextFunction, Response } from "express";

import {
  ProductModal,
  TypedProduct,
  IProduct,
} from "../models/productModel";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { IModifiedRequest } from "../types";

const getAllListings = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const listings: TypedProduct[] | null =
      await ProductModal.find();

    res.status(200).json({
      status: "success",
      data: {
        length: listings?.length || 0,
        listings: listings,
      },
    });
  }
);

const addListing = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const {
      productName,
      productDescription,
      price,
      quantityAvailable,
      productImage,
    } = req.body;

    if (!req.user?._id)
      return next(new AppError("User not logged in", 401));

    const newListing = await ProductModal.create({
      productName,
      productDescription,
      price,
      quantityAvailable,
      productImage,
      listedBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
    });
  }
);

export { getAllListings, addListing };
