/* eslint-disable space-before-function-paren */
/* eslint-disable no-invalid-this */
import { Schema, model } from "mongoose";
import slugify from "slugify";

const productsSchema = new Schema({
  slug: String,
  new: Boolean,
  shortName: String,
  name: {
    type: String,
    trim: true,
    required: [true, "A product must have a name"],
    minlength: [2, "A product must have more than two characters"],
  },
  price: { type: Number, required: [true, "A product must have a price"] },
  image: { type: String, required: [true, "A product must have an Image"] },
  features: { type: String, trim: true, required: [true, "A product must have some features"] },
  description: {
    type: String,
    trim: true,
    required: [true, "A product must have a description"],
  },
  gallery: [String],
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
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
});

productsSchema.virtual("discount").get(function () {
  return this.price - 20;
});

// document middleware: runs before save() and create()
productsSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    replacement: "-",
  });
  next();
});

/*
document middleware: runs after save() and create()
productsSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

*/

// QUERY MIDDLEWARE

// productsSchema.pre("find", function () {
//   this.find({ secret: { $ne: true } });
// });

const Product = model("Product", productsSchema);

export default Product;
