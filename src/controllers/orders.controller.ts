import { Response, Request } from "express";
import Order from "../models/orders.model";

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
