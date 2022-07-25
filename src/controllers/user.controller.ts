import User from "../models/user.model";
import { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  console.log(req.body);
  const users = await User.find();
  return res.status(200).json({ status: "success", data: { users } });
};
