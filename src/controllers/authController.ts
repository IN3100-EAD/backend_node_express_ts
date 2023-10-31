import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { IUser, UserModal } from "../models/userModel";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface IModifiedRequest extends Request {
  user?: mongoose.Document<IUser>;
}

interface RegisterRequestBody {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

interface ITokenProps {
  id: string;
  name: string;
  email: string;
  role: string;
}

const createSendingToken = (
  tokenProps: ITokenProps,
  statusCode: number,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET: string | undefined =
    process.env.JWT_SECRET;
  const JWT_EXPIRES_IN: string | undefined =
    process.env.JWT_EXPIRES_IN;

  if (!JWT_EXPIRES_IN || !JWT_SECRET)
    return next(
      new AppError(
        "JWT_EXPIRES_IN or JWT_SECRET is not defined",
        500
      )
    );

  const jwtToken = jwt.sign(tokenProps, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const JWT_EXPIRES_IN_MS =
    Number(JWT_EXPIRES_IN.slice(0, -1)) *
    24 *
    60 *
    60 *
    1000;

  const cookieOptions = {
    expires: new Date(Date.now() + JWT_EXPIRES_IN_MS),
    httpOnly: true,
    secure: process.env.NODE_ENV?.trim() === "production",
  };

  res.cookie("jwt", jwtToken, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token: jwtToken,
  });
};

export const register = catchAsync(
  async (
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      email,
      name,
      password,
      confirmPassword,
      phoneNumber,
    } = req.body;

    const newUser = await UserModal.create({
      email,
      name,
      password,
      confirmPassword,
      phoneNumber,
    });

    const tokenProps: ITokenProps = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    createSendingToken(tokenProps, 201, res, next);
  }
);

export const login = catchAsync(
  async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    //1) Check if email and password exist
    if (!email || !password)
      return next(
        new AppError(
          "Please provide email and password",
          400
        )
      );

    //2) Check if user exists && password is correct
    const user = await UserModal.findOne({ email }).select(
      "+password"
    );

    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    )
      return next(
        new AppError("Incorrect email or password", 401)
      );

    //3) If everything ok, send token to client
    const tokenProps: ITokenProps = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    createSendingToken(tokenProps, 200, res, next);
  }
);

// PROTECTED ROUTES
export const protectedRoute = catchAsync(
  async (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    let token: string | undefined;

    //1) Getting token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401
        )
      );
    }

    //2) Verification token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    console.log(decoded);

    //3) Check if user still exists
    const currentUser = await UserModal.findById(
      decoded.id
    );

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }
);
