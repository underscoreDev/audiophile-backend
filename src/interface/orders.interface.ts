/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export enum OrderPaymentStatus {
  pending = "pending",
  canceled = "canceled",
  paid = "paid",
}

export enum OrderDeliveryStatus {
  pending = "pending",
  shipped = "shipped",
  delivered = "delivered",
}

export interface OrderProps {
  ordersItems: [{ product: {}; quantity: number }];
  user: string;
  shippingInfo: { address: string; city: string; country: string; zipCode: string };

  orderedAt: Date;
  orderPaymentStatus: OrderPaymentStatus;

  orderDeliveryStatus: OrderDeliveryStatus;
  deliveredAt: Date;

  shippingFee: number;
  productsTotal: number;
  grandTotal: number;
}

export interface OrderInstanceMethods {}

export interface OrderModel extends Model<OrderProps, {}, OrderInstanceMethods> {
  calcOrderItemsTotal: (productId: string) => Promise<OrderProps>;
}
