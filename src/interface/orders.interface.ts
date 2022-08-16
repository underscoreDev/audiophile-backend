/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export enum PaymentStatus {
  placed = "placed",
  canceled = "canceled",
  paid = "paid",
}
export interface OrderProps {
  ordersItems: [
    {
      product: {};
      quantity: number;
    }
  ];

  user: {};

  paymentMethod: string;

  shippingInfo: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };

  tax: number;
  shippingFee: number;
  totalPrice: number;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}

export interface OrderInstanceMethods {}

export interface OrderModel extends Model<OrderProps, {}, OrderInstanceMethods> {
  calcOrderItemsTotal: (productId: string) => Promise<OrderProps>;
}
