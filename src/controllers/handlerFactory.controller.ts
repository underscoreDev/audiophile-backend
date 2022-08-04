/* eslint-disable indent */
import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/handleAppError.middleware";
import Reviews from "../models/reviews.model";
import Product from "../models/product.model";
import User from "../models/user.model";

export const deleteHandler =
  (Model: typeof Reviews | typeof Product | typeof User) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    return res.status(204).json({ status: "success", data: null });
  };

export const createHandler =
  (Model: typeof Reviews | typeof Product | typeof User) => async (req: Request, res: Response) => {
    const newP = await Model.create(req.body);
    return res.status(201).json({ status: "success", data: { data: newP } });
  };

export const updateHandler =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    return res.status(201).json({ status: "success", data: { data: doc } });
  };
