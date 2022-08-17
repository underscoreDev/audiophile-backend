/* eslint-disable no-invalid-this */
import { Schema, model, SchemaTypes } from "mongoose";

const cartSchema = new Schema(
  {
    // product: {
    //   type: SchemaTypes.ObjectId,
    //   ref: "Product",
    //   required: [true, "A cart must have a product"],
    // },

    // quantity: { type: Number, default: 1 },

    products: [
      {
        product: { type: SchemaTypes.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],

    user: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Cart must belong to a user"],
    },

    vat: { type: Number, default: 10, select: false },

    shippingFee: { type: Number, default: 10, select: false },

    totalPrice: { type: Number, default: 0, select: false },

    grandTotal: { type: Number, default: 0, select: false },
  },
  { versionKey: false }
);

// prevent duplicate products in a cart
// cartSchema.index({ products: 1, user: 1 }, { unique: true });

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "products.product",
    select: "slug name price image",
  });
  next();
});

const Cart = model("Cart", cartSchema);

export default Cart;
