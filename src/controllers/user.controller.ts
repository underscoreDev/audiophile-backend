/* eslint-disable no-new-object */
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/handleAppError.middleware";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  return res.status(200).json({ status: "success", data: { users } });
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm) {
    return next(
      new AppError("This route is not for password updates. Please use /update-password", 400)
    );
  }

  const obj = {
    firstname: req.body.firstname ?? req.body.user.firstname,
    lastname: req.body.lastname ?? req.body.user.lastname,
    email: req.body.email ?? req.body.user.email,
  };

  const user = await User.findByIdAndUpdate(req.body.user._id, obj, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ status: "User Updated successfully", data: { user } });
};

export const deleteMe = async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.body.user._id, { active: false });

  res.status(204).json({
    status: "User Deleted Successfully",
    data: null,
  });
};

export const getUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
export const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
export const deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
