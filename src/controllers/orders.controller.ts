import "dotenv/config";
import Stripe from "stripe";
import Product from "../models/product.model";
import { Response, Request, NextFunction } from "express";
import { AppError } from "../middlewares/handleAppError.middleware";

const { STRIPE_SECRET_KEY } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  typescript: true,
  apiVersion: "2022-08-01",
});

export const getCheckoutsession = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new AppError("No product with that Id", 400));
  }

  const session = await stripe.paymentIntents.create({});

  return res.status(200).json({ status: "success", session });
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {};
