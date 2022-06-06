import { Schema, model } from "mongoose";

const productsSchema = new Schema({
  slug: String,
  new: Boolean,
  shortName: String,
  name: { type: String, required: [true, "A product must have a name"] },
  price: { type: Number, required: [true, "A product must have a price"] },
  image: { type: String, required: [true, "A product must have an Image"] },
  features: { type: String, required: [true, "A product must have some features"] },
  description: { type: String, required: [true, "A product must have a description"] },

  category: {
    type: String,
    trim: true,
    required: [true, "The product must belong to a category!"],
    enum: {
      values: ["headphones", "earphones", "speakers"],
      message: "The category must be either 'headphones', 'earphones' or 'speakers'",
    },
  },

  includedItems: [
    {
      quantity: {
        type: String,
        required: [true, "A product must inform how much of this item comes inside of the box."],
      },
      item: {
        type: String,
        required: [true, "A product must inform what comes inside of the box."],
      },
    },
  ],

  gallery: [
    {
      imageUrl: String,
      images: { type: String, required: [true, "A product must have images"] },
    },
  ],
});

const Product = model("Product", productsSchema);

export default Product;
