import AppError from "../utils/appError";
import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";

//? ERROR_TYPE: CAST_ERROR (INVALID_ID)
const handleCastErrorDB = (
  err: mongoose.Error.CastError
) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//? ERROR_TYPE: DUPLICATE_FIELD_ERROR
const handleDuplicateFieldsDB = (
  err: mongoose.Error.ValidationError
) => {
  const value = err.message?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// ? ERROR_TYPE: VALIDATION_ERROR (MISSING_FIELDS)
const handleValidationErrorDB = (
  err: mongoose.Error.ValidationError
) => {
  const errors = Object.values(err.errors).map(
    (el) => el.message
  );
  const message = `Invalid input data. ${errors.join(
    ". "
  )}`;
  return new AppError(message, 400);
};

// ? ERROR_TYPE: JWT_ERROR (INVALID_TOKEN)
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

// ? ERROR_TYPE: JWT_ERROR (TOKEN_EXPIRED)
const handleJWTExpiredError = () =>
  new AppError(
    "Your token has expired! Please log in again.",
    401
  );

// ERROR HANDLING: DEVELOPMENT_STAGE (MORE_INFO)
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// ERROR HANDLING: PRODUCTION_STAGE (LESS_INFO)
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// ERROR HANDLING: GLOBAL_ERROR_HANDLER
const globalErrorController = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV?.trim() === "development") {
    sendErrorDev(err, res);
  } else if (
    process.env.NODE_ENV?.trim() === "production"
  ) {
    sendErrorProd(err, res);
  }
  next();
};

export default globalErrorController;
