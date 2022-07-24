import User from "../models/user.model";
import { UserProps } from "../models/user.model";
import { Response, Request, NextFunction } from "express";
import { AppError } from "../middlewares/handleAppError.middleware";
import bcrypt from "bcrypt";
import { signJwt } from "../middlewares/auth.middleware";
import validator from "validator";

export const signUp = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, passwordConfirm, photo }: UserProps = req.body;

  // create user
  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
    photo,
  });

  // generate jwt token
  const token = signJwt(newUser._id);
  // send to client
  return res.status(201).json({
    status: "User created Successfully",
    data: {
      token,
      user: newUser,
    },
  });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password || !validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Email doesn't exist", 401));
  }

  const verify = await bcrypt.compare(password, user.password);

  if (!verify) {
    return next(new AppError("Incorrect Password", 401));
  }

  const token = signJwt(user._id);

  // send to client
  return res.status(201).json({
    status: "success",
    data: {
      token,
    },
  });
};
