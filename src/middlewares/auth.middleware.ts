/* eslint-disable indent */
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Types } from "mongoose";
import { roles } from "../interface/user.interface";
import User from "../models/user.model";
import { AppError } from "./handleAppError.middleware";
import { Request, Response, NextFunction } from "express";
import sendEmail from "../utils/email.util";

const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = process.env;

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

export const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signJwt(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV === "production" ? true : false,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  // send to client
  return res.status(statusCode).json({ status: "Success", token, data: { user } });
};

export const semdEmailVerificationLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
  { user, emailToken }: any
) => {
  try {
    const verifyUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/confirm-email/${emailToken}`;

    // eslint-disable-next-line max-len
    const message = `<h3>Click this link to Confirm your email</h3><a href=${verifyUrl} target="_blank">Confirm Email</a> <h4>Confirmation code is Valid for 10 minutes</h4>`;
    await sendEmail({
      from: "Audiophile <audiophile@audiophile.com>",
      to: user.email,
      subject: "Email Confirmation Code",
      html: message,
    });
    return res
      .status(201)
      .json({ status: "Successful", message: "Confirmation Link sent to email" });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(`There was an error sending the Confirmation Link ${error}`, 500));
  }
};

export const sendForgotPasswordToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
  { resetToken, user }: any
) => {
  try {
    // eslint-disable-next-line max-len
    const message = `<h2>${resetToken} is your password reset token.</h2><h4>Valid for 10 minutes</h4>`;
    await sendEmail({
      from: "Audiophile <audiophile@audiophile.com>",
      to: user.email,
      subject: "Password reset token",
      html: message,
    });
    return res
      .status(200)
      .json({ status: "success", message: "Password Reset Token sent user's Email" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(`There was an error sending the token ${error}`, 500));
  }
};
