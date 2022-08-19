import axios from "axios";
import "dotenv/config";
import { Response, Request } from "express";
import Order from "../models/orders.model";

export const getCheckoutsession = async (req: Request, res: Response) => {
  const { orderItems, shippingInfo } = req.body;
  const user = req.user;
  const order = await Order.create({ orderItems, shippingInfo, user: user.id });

  const { data } = await axios({
    method: "post",
    url: "https://api.flutterwave.com/v3/payments",

    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    },

    data: {
      tx_ref: order._id,
      amount: order.grandTotal,
      currency: "NGN",
      redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",

      customer: {
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
      },

      meta: { orderDetails: order.orderItems, shippingInfo: order.shippingInfo },

      customizations: {
        title: "Audiophile E-commerce Checkout",
        logo: req.user.photo,
      },
    },
  });
  return res.status(200).json(data);
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
