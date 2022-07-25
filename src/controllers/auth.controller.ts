import validator from "validator";
import User from "../models/user.model";
import { UserProps } from "../models/user.model";
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
