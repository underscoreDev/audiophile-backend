import crypto from "crypto";
import { config } from "dotenv";
import validator from "validator";
import User from "../models/user.model";
import { UserProps } from "../interface/user.interface";
import sendEmail from "../utils/email.util";
import { Response, Request, NextFunction } from "express";
import { createSendToken } from "../middlewares/auth.middleware";
import { AppError } from "../middlewares/handleAppError.middleware";

config();

export const signUp = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, passwordConfirm, photo }: UserProps = req.body;
  // create user
  const newUser = await User.create({
    photo,
    email,
    password,
    lastname,
    firstname,
    passwordConfirm,
  });

  const user = {
    _id: newUser._id,
    email: newUser.email,
    photo: newUser.photo,
    lastname: newUser.lastname,
    firstname: newUser.firstname,
  };

  createSendToken(user, 201, res);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // check if email and password is entered and if email is valid
  if (!email || !password || !validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email or password", 400));
  }
  // check if user exists
  const user = await User.findOne({ email }).select("+password");
  // check if the password is correct
  const validPassword = await user?.comparePasswords(password, user.password);
  // return an error if anything is incorrect
  if (!user || !validPassword) {
    return next(new AppError("Invalid Login credentials", 401));
  }
  createSendToken(user, 200, res);
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
  // eslint-disable-next-line max-len
  const message = `<h2>Forgot password ?.</h2> <h3>Click the link below to reset your password</h3><a href=${resetUrl} target="_blank">Reset Password</a> <h4>Valid for 10 minutes</h4>`;
  try {
    await sendEmail({
      from: "Audiophile <audiophile@audiophile.com>",
      to: user.email,
      subject: "Password reset token",
      html: message,
    });
    return res
      .status(200)
      .json({ status: "success", message: "Password Reset Token sent to Email" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(`There was an error sending the token ${error}`, 500));
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const resetToken = req.params.reset_id;
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token expired or invalid", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  // get user from collection
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  // check if user exists
  const user = await User.findById(req.body.user._id).select("+password");

  // check if posted current password is correct
  const validPassword = await user?.comparePasswords(oldPassword, user.password);
  // return an error if anything is incorrect
  if (!user || !validPassword) {
    return next(new AppError("Wrong password", 401));
  }
  // if so, update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();
  createSendToken(user, 200, res);
};
