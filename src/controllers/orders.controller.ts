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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/api/v1`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/products/${product.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.productId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: product.price * 100,
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.image],
          },
        },
        quantity: 1,
      },
    ],
  });

  return res.status(200).json({ status: "success", session });
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {};
