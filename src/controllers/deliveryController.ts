import { NextFunction, Response } from "express";

import { DeliveryModel } from "../models/deliveryModel";
import { catchAsync } from "../utils/catchAsync";
import { IModifiedRequest } from "../types";
import AppError from "../utils/appError";

// ASSIGN ORDER TO DELIVERY PERSON
export const assignOrder = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const delivery = await DeliveryModel.create({
      orderId: req.params.id,
      deliveryPersonId: req.body.deliveryPersonId,
    });

    res.status(201).json({
      status: "success",
      deliveryId: delivery._id,
    });
  }
);

// GET ALL DELIVERIES BY DELIVERY PERSON ID
export const getAllDeliveriesById = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const deliveries = await DeliveryModel.find({
      deliveryPersonId: req.params.id,
    });

    if (!deliveries)
      return next(
        new AppError(
          "No deliveries found with that ID",
          404
        )
      );

    res.status(200).json({
      status: "success",
      data: {
        deliveries,
      },
    });
  }
);

// GET DELIVERY STATUS FOR PARTICULAR ORDER
export const getDeliveryStatus = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const delivery = await DeliveryModel.findOne({
      orderId: req.params.id,
    });

    if (!delivery)
      return next(
        new AppError("No delivery found with that ID", 404)
      );

    res.status(200).json({
      status: "success",
      data: {
        delivery,
      },
    });
  }
);
