/* eslint-disable no-new-object */
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import {
  deleteHandler,
  updateHandler,
  getOneHandler,
} from "../middlewares/handlerFactory.controller";
import { AppError } from "../middlewares/handleAppError.middleware";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  const sendUsers = users.map((user) => {
    return {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      photo: user.photo,
      role: user.role,
    };
  });

  return res.status(200).json({ status: "success", data: { users: sendUsers } });
};

export const deleteMe = async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(204).json({ status: "User Deleted Successfully", data: null });
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = getOneHandler(User, {
  path: "favouriteProducts",
  select: "name image price",
});
export const updateUser = updateHandler(User);
export const deleteUser = deleteHandler(User);

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm) {
    return next(
      new AppError("This route is not for password updates. Please use /update-password", 400)
    );
  }

  const obj = {
    firstname: req.body.firstname ?? req.user.firstname,
    lastname: req.body.lastname ?? req.user.lastname,
    email: req.body.email ?? req.user.email,
    photo: req.file && req.file?.filename,
  };

  const user = await User.findByIdAndUpdate(req.user?.id, obj, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ status: "User Updated successfully", data: { user } });
};

export const favouriteProducts = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);
  user?.AddOrRemoveFavouriteProduct(productId);
  await user?.save({ validateBeforeSave: false });
  return res.status(200).json({ status: "success", message: "Product added to favourites" });
};
