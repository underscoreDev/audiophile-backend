import "dotenv/config";
import crypto from "crypto";
import validator from "validator";
import User from "../models/user.model";
import sendEmail from "../utils/email.util";
import { UserProps } from "../interface/user.interface";
import { Response, Request, NextFunction } from "express";
import { createSendToken } from "../middlewares/auth.middleware";
import { AppError } from "../middlewares/handleAppError.middleware";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { firstname, lastname, email, password, passwordConfirm, photo }: UserProps = req.body;
  // create user
  const user = await User.create({
    photo,
    email,
    password,
    lastname,
    firstname,
    passwordConfirm,
  });
  const emailToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    const verifyUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/confirm-email/${emailToken}`;

    // eslint-disable-next-line max-len
    const message = `<h2>Thanks for Signing Up on Audiophile</h2> <h3>Please Click this link to Confirms your email</h3><a href=${verifyUrl} target="_blank">Confirm Email</a> <h4>Confirmation code is Valid for 10 minutes</h4>`;
    await sendEmail({
      from: "Audiophile <audiophile@audiophile.com>",
      to: user.email,
      subject: "Email Confirmation Code",
      html: message,
    });

    return res
      .status(201)
      .json({ status: "Registration Successful", message: "Please confirm your email" });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(`Registration Unsuccessful. There was an error sending the token ${error}`, 500)
    );
  }
};

export const confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
  const confirmationCode = req.params.confirm_token;
  const hashedToken = crypto.createHash("sha256").update(confirmationCode).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token expired or invalid", 400));
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
};

export const resendEmailConfirmationToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  // check if email and password is entered and if email is valid
  if (!email || !validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email", 400));
  }
  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 401));
  }

  const emailToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

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
      .json({ status: "Successful", message: "Confirmation code sent to email" });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(`There was an error sending the code ${error}`, 500));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // check if email and password is entered and if email is valid
  if (!email || !password || !validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email or password", 400));
  }
  // check if user exists
  const user = await User.findOne({ email }).select("+password").select("+isEmailVerified");
  // check if the password is correct
  const validPassword = await user?.comparePasswords(password, user.password);
  // return an error if anything is incorrect
  if (!user || !validPassword) {
    return next(new AppError("Invalid Login credentials", 401));
  }
  if (!user.isEmailVerified) {
    return next(new AppError("Please verify your email", 401));
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

  // eslint-disable-next-line max-len
  const message = `<h2>${resetToken} is your password reset token.</h2><h4>Valid for 10 minutes</h4>`;
  try {
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

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { resetToken, password, passwordConfirm } = req.body;

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token expired or invalid", 400));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
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
