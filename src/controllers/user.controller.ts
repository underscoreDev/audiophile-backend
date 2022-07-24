import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: { users },
  });
};
