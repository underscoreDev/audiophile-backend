import { Model } from "mongoose";

export interface OrderProps {
  ordersItems: [
    {
      product: {};
      quantity: number;
    }
  ];

  user: {};

  paymentMethod: string;

  paymentStatus: string;

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
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}

export interface OrderInstanceMethods {}

export interface OrderModel extends Model<OrderProps, {}, OrderInstanceMethods> {
  calcOrderItemsTotal: (productId: string) => Promise<OrderProps>;
}
