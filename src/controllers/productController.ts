import { NextFunction, Response } from "express";
import Stripe from "stripe";

import {
  ProductModel,
  TypedProduct,
  IProduct,
} from "../models/productModel";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { IModifiedRequest } from "../types";
import {
  createStripeProduct,
  updateStripeProductPrice,
} from "../utils/stripePayments";

const getAllListings = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const listings: TypedProduct[] | null =
      await ProductModel.find();

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
      name,
      description,
      price,
      quantity,
      mainImage,
      additionalImages,
    } = req.body;

    if (!req.user?._id)
      return next(new AppError("User not logged in", 401));

    const newListing = await ProductModel.create({
      name,
      description,
      price,
      quantity,
      mainImage,
      additionalImages,
      listedBy: req.user._id,
    });

    try {
      await createStripeProduct(
        newListing.id,
        newListing.name,
        newListing.description,
        newListing.price * 100,
        newListing.mainImage
      );
    } catch (error) {
      // DELETE THE LISTING FROM MONGODB IF STRIPE PRODUCT CREATION FAILS
      await ProductModel.findByIdAndDelete(newListing.id);

      console.log(error);

      return next(
        new AppError(
          "Error creating product in stripe. Please try again later",
          500
        )
      );
    }

    res.status(201).json({
      status: "success",
    });
  }
);

const getAllListingsByUser = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user?._id)
      return next(new AppError("User not logged in", 401));

    const listings: TypedProduct[] | null =
      await ProductModel.find({ listedBy: req.params.id });

    res.status(200).json({
      status: "success",
      data: {
        length: listings?.length || 0,
        listings: listings,
      },
    });
  }
);

// UPDATE PRICE OF A PRODUCT
const updatePriceListing = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { updatedPrice } = req.body;

    if (!req.user?._id)
      return next(new AppError("User not logged in", 401));

    const listing = await ProductModel.findById(id);

    if (!listing)
      return next(new AppError("No listing found", 404));

    const oldPrice = listing.price;
    listing.price = updatedPrice;
    await listing.save({
      validateBeforeSave: false,
    });

    // UPDATE PRICE IN STRIPE
    try {
      await updateStripeProductPrice(
        id,
        updatedPrice * 100
      );
    } catch (error) {
      // REVERT THE PRICE IN MONGODB IF STRIPE PRODUCT PRICE UPDATE FAILS
      listing.price = oldPrice;
      await listing.save({
        validateBeforeSave: false,
      });

      console.log(error);

      return next(
        new AppError(
          "Error updating product price in stripe. Please try again later",
          500
        )
      );
    }

    res.status(200).json({
      status: "success",
    });
  }
);

export {
  getAllListings,
  addListing,
  getAllListingsByUser,
  updatePriceListing,
};
