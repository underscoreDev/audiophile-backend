/* eslint-disable no-invalid-this */
import { Schema, model, SchemaTypes } from "mongoose";
import {
  OrderProps,
  OrderModel,
  OrderInstanceMethods,
  OrderPaymentStatus,
  OrderDeliveryStatus,
} from "../interface/orders.interface";

const ordersSchema = new Schema<OrderProps, OrderModel, OrderInstanceMethods>({
  ordersItems: [
    {
      _id: false,
      product: { type: SchemaTypes.ObjectId, ref: "Product", unique: true },
      quantity: { type: Number, default: 1 },
    },
  ],

  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "orders must belong to a user"],
  },

  shippingInfo: {
    address: { type: String, required: [true, "order must have a shipping address"], trim: true },
    city: { type: String, required: [true, "order must have a shipping city"], trim: true },
    country: { type: String, required: [true, "order must have a shipping country"], trim: true },
    zipCode: { type: String },
  },

  orderedAt: { type: Date, default: Date.now },

  orderPaymentStatus: {
    type: String,
    enum: [OrderPaymentStatus.pending, OrderPaymentStatus.canceled, OrderPaymentStatus.paid],
    default: OrderPaymentStatus.pending,
  },

  orderDeliveryStatus: {
    type: String,
    enum: [OrderDeliveryStatus.pending, OrderDeliveryStatus.shipped, OrderDeliveryStatus.delivered],
    default: OrderDeliveryStatus.pending,
  },

  deliveredAt: { type: Date },

  shippingFee: { type: Number },
  productsTotal: { type: Number },
  grandTotal: { type: Number },
});

ordersSchema.pre("save", function (next) {
  const greg = this.ordersItems;
  console.log(greg);
  // this.productsTotal=
  next();
});

ordersSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstname lastname id photo email",
  });
  next();
});

ordersSchema.pre(/^find/, function (next) {
  this.populate({
    path: "ordersItems.product",
    select: "slug name price image",
  });
  next();
});

const Order = model<OrderProps, OrderModel>("Order", ordersSchema);

export default Order;
