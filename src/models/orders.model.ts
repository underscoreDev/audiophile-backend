/* eslint-disable no-invalid-this */
import { Schema, model, SchemaTypes } from "mongoose";
import {
  OrderProps,
  OrderModel,
  OrderInstanceMethods,
  PaymentStatus,
} from "../interface/orders.interface";

const ordersSchema = new Schema<OrderProps, OrderModel, OrderInstanceMethods>({
  ordersItems: [
    {
      productId: { type: SchemaTypes.ObjectId, ref: "Product", required: true },
      slug: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      description: { type: String },
      quantity: {
        type: Number,
        required: [true, "A orders must tell how many of a product is being bought "],
      },
    },
  ],

  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "orders must belong to a user"],
  },

  paymentMethod: { type: String, default: "card" },

  shippingInfo: {
    address: { type: String, required: [true, "order must have a shipping address"], trim: true },
    city: { type: String, required: [true, "order must have a shipping city"], trim: true },
    country: { type: String, required: [true, "order must have a shipping country"], trim: true },
    zipCode: { type: String, required: [true, "order must have a zipCode"], trim: true },
  },

  tax: { type: Number, default: 10 },

  shippingFee: { type: Number, default: 10 },

  totalPrice: { type: Number, default: 0 },

  grandTotal: { type: Number, default: 0 },

  paymentStatus: {
    type: String,
    enum: [PaymentStatus.canceled, PaymentStatus.paid, PaymentStatus.placed],
    default: PaymentStatus.placed,
  },

  createdAt: { type: Date, default: Date.now },

  isDelivered: { type: Boolean, default: false },

  deliveredAt: { type: Date },
});

ordersSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstname lastname id photo email",
  });
  next();
});

const Order = model<OrderProps, OrderModel>("Order", ordersSchema);

export default Order;

/*
////////////////////////////////////////////////////////
/////////////// ****TODO**** ///////////////////////////
//////////////////////////////////////////////////////

1. calculate total price, grand-total on orders


*/
