/* eslint-disable indent */
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./handleAppError.middleware";
import User, { roles } from "../models/user.model";
// import { roles } from '../models/user.model';
config();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const signJwt = (id: Types.ObjectId) =>
  jwt.sign({ id }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN });

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization?.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in Please provide a token", 400));
  }
  const verify = jwt.verify(token, JWT_SECRET as string);

  const decoded = verify as jwt.JwtPayload;
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("The user belonging to this token doesn't exist", 401));
  }

  if (currentUser.changedPasswordAfter(decoded?.iat ?? 0)) {
    return next(new AppError("User recently changed password! Please login again", 401));
  }

  req.body.user = currentUser;
  next();
};

export const restrictTo =
  ([...userRoles]: roles[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!userRoles.includes(req.body.user?.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
