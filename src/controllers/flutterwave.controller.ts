/* eslint-disable max-len */
import "dotenv/config";
import axios from "axios";
import { Response, Request } from "express";
import Order from "../models/orders.model";
import { Email } from "../utils/email.util";
import { OrderStatus } from "../interface/orders.interface";

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
      redirect_url: "https://audiophile.vercel.app/", // TODO: REPLACE WITH WEBHOOK URL WHEN THE SITE IS LIVE

      customer: {
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
      },

      meta: { orderDetails: order.orderItems, shippingInfo: order.shippingInfo },

      customizations: {
        title: "Audiophile",
        logo: req.user.photo,
      },
    },
  });
  return res.status(200).json(data);
};

// export const createOrder = async (req: Request, res: Response) => {
//   const { orderItems, shippingInfo } = req.body;
//   const { id } = req.user;
//   const order = await Order.create({ orderItems, shippingInfo, user: id });
//   return res.status(201).json({ status: "Order Created Successfully", data: { order } });
// };

export const getUserOrder = async (req: Request, res: Response) => {
  const order = await Order.find({ user: req.user.id });
  return res.status(200).json({ status: "success", data: { order } });
};

// In an Express-like app:

export const flwWebhook = async (req: Request, res: Response) => {
  // If you specified a secret hash, check for the signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];

  if (!signature || signature !== secretHash) {
    // This request isn't from Flutterwave; discard
    res.status(401).send("Webhook error");
  }

  const { event, data } = req.body;

  if (event === "charge.completed") {
    // change order status to OrderStatus.confirmed,

    const { tx_ref: orderId } = data;

    const order = await Order.findByIdAndUpdate(orderId, { orderStatus: OrderStatus.confirmed });

    if (!order) {
      return;
    }

    // send an email
    const { email, firstname } = order.user;

    const SendEmail = new Email({ email, firstname });

    SendEmail.send(
      `Your order has been confirmed see details below: ${order.orderItems.forEach(
        (o) =>
          `<h3>${o.product.name}</h3> <img src=${o.product.image}/> <span>${o.product.price}</span>`
      )}

      <h2>TOTAL: ${order.grandTotal}</h2>

      `,
      "Order Confirmed"
    );

    return res.status(200).json({ status: "Order Confirmed and email has been sent" });
  }
};
