import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const { JWT_SECRET } = process.env;

export const signJwt = (id: string) => jwt.sign({ id }, JWT_SECRET as string, { expiresIn: "10d" });
