import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/handleAppError.middleware";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  return res.status(200).json({ status: "success", data: { users } });
};

const filterObj = (obj: {}, allowedFields: string[]) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm) {
    return next(
      new AppError("This route is not for password updates. Please use /update-password", 400)
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, ["name", "email"]);
  const user = await User.findByIdAndUpdate(req.body.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({ status: "success", data: { user } });
};

exports.deleteMe = async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.body.user._id, { active: false });

  res.status(204).json({
    status: "User Deleted Successfully",
    data: null,
  });
};

exports.getUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
