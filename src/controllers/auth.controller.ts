import crypto from "crypto";
import validator from "validator";
import User from "../models/user.model";
import { UserProps } from "../interface";
import sendEmail from "../utils/email.util";
import { signJwt } from "../middlewares/auth.middleware";
import { Response, Request, NextFunction } from "express";
import { AppError } from "../middlewares/handleAppError.middleware";

export const signUp = async (req: Request, res: Response) => {
  const { firstname, role, lastname, email, password, passwordConfirm, photo }: UserProps =
    req.body;
  // create user
  const newUser = await User.create({
    email,
    photo,
    role,
    password,
    lastname,
    firstname,
    passwordConfirm,
  });
  // generate jwt token
  const token = signJwt(newUser._id);
  // send to client
  return res.status(201).json({
    status: "User created Successfully",
    data: { token, user: newUser },
  });
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
  //  else sign jwt and login the user
  const token = signJwt(user._id);
  // send to client
  return res.status(200).json({ status: "success", data: { token } });
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
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(`There was an error sending the token ${error}`, 500));
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const resetToken = req.params.reset_id;
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token expired or invalid", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //  else sign jwt and login the user
  const token = signJwt(user._id);
  // send to client
  return res.status(200).json({ status: "success", data: { token } });
};
