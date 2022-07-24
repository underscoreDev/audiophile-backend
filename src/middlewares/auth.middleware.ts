import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Types } from "mongoose";
config();

const { JWT_SECRET } = process.env;

export const signJwt = (id: Types.ObjectId) =>
  jwt.sign({ id }, JWT_SECRET as string, { expiresIn: "10d" });
