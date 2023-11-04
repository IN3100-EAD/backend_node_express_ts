import { NextFunction, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import {
  IOrder,
  TypedOrder,
  orderModel,
} from "../models/orderModel";
import { IModifiedRequest } from "types";
import { ProductModel } from "../models/productModel";

export const createOrder = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user?.id)
      return next(
        new AppError("User is not logged in", 401)
      );

    const { orderDetails, paymentId } = req.body;

    if (!orderDetails || !paymentId)
      return next(
        new AppError("Order details are required", 400)
      );

    let modifiedOrderDetails = [{}];
    let totalAmount = 0;

    orderDetails.forEach(async (item: any) => {
      const orderItem = await ProductModel.findById(
        item.productId
      );

      if (!orderItem)
        return next(
          new AppError(
            "Product does not exist in database",
            400
          )
        );

      if (orderItem.quantity < item.quantity)
        return next(
          new AppError(
            "Product quantity is not available",
            400
          )
        );

      const modifiedOrderItem = {
        productId: item.productId,
        quantity: item.quantity,
        price: orderItem.price,
      };

      modifiedOrderDetails.push(modifiedOrderItem);
      totalAmount += orderItem.price * item.quantity;

      orderItem.quantity -= item.quantity;
      await orderItem.save({
        validateBeforeSave: false,
      });
    });

    const newOrder = await orderModel.create({
      orderDetails: modifiedOrderDetails,
      paymentId,
    });

    res.status(201).json({
      status: "success",
      orderId: newOrder._id,
    });
  }
);
