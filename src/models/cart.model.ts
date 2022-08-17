/* eslint-disable no-invalid-this */
import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    vat: { type: Number, default: 10, select: false },

    shippingFee: { type: Number, default: 10, select: false },

    totalPrice: { type: Number, default: 0, select: false },

    grandTotal: { type: Number, default: 0, select: false },
  },
  { versionKey: false }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "products.product",
    select: "slug name price image",
  });
  next();
});

const Cart = model("Cart", cartSchema);

export default Cart;
