import "dotenv/config";
// import Stripe from "stripe";
import { Response, Request, NextFunction } from "express";
import { AppError } from "../middlewares/handleAppError.middleware";
import Order from "../models/orders.model";

// const { STRIPE_SECRET_KEY } = process.env;

// const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
//   typescript: true,
//   apiVersion: "2022-08-01",
// });

export const getCheckoutsession = async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new AppError("No order with that Id", 400));
  }

  // const session = await stripe.paymentIntents.create({ currency: "usd" });

  // return res.status(200).json({ status: "success", session });
};

export const createOrder = async (req: Request, res: Response) => {
  const { orderItems, shippingInfo } = req.body;
  const { id } = req.user;
  const order = await Order.create({ orderItems, shippingInfo, user: id });
  return res.status(201).json({ status: "Order Created Successfully", data: { order } });
};

export const getUserOrder = async (req: Request, res: Response) => {
  const order = await Order.find({ user: req.user.id });
  return res.status(200).json({ status: "success", data: { order } });
};
