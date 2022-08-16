import { Schema, model, SchemaTypes } from "mongoose";
import { OrderProps, OrderModel, OrderInstanceMethods } from "../interface/orders.interface";

const ordersSchema = new Schema<OrderProps, OrderModel, OrderInstanceMethods>({
  ordersItems: [
    {
      product: { type: SchemaTypes.ObjectId, ref: "Product", required: true },
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
  paymentStatus: { type: String, default: "pending" },

  shippingInfo: {
    address: { type: String, required: [true, "order must have a shipping address"], trim: true },
    city: { type: String, required: [true, "order must have a shipping city"], trim: true },
    country: { type: String, required: [true, "order must have a shipping country"], trim: true },
    zipCode: { type: String, required: [true, "order must have a zipCode"], trim: true },
  },

  tax: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 10 },
  totalPrice: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date, default: Date.now },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
});

const Order = model<OrderProps, OrderModel>("Order", ordersSchema);

export default Order;
