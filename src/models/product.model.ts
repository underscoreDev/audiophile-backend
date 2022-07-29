/* eslint-disable no-invalid-this */
import slugify from "slugify";
import { Schema, model, Model } from "mongoose";
import { ProductProps, productsCategories } from "../interface/products.interface";

type ProductsModel = Model<ProductProps, {}, {}>;

const productSchema = new Schema<ProductProps, ProductsModel, {}>(
  {
    slug: String,
    new: { type: Boolean, default: true },
    quantity: { type: Number, required: [true, "A product must tell how many of it is in stock"] },
    inStock: { type: Boolean, default: true },
    name: {
      type: String,
      trim: true,
      required: [true, "A product must have a name"],
      minlength: [2, "A product name must have at least two characters"],
    },

    price: { type: Number, required: [true, "A product must have a price"] },

    image: { type: String, required: [true, "A product must have an Image"] },

    features: { type: String, trim: true, required: [true, "A product must have some features"] },

    description: {
      type: String,
      trim: true,
      required: [true, "A product must have a description"],
    },

    productImageGallery: [String],

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
        values: [
          productsCategories.earphones,
          productsCategories.headphones,
          productsCategories.speakers,
        ],
        message: "The category must be either 'headphones', 'earphones' or 'speakers'",
      },
    },

    includedItems: [
      {
        _id: false,
        quantity: {
          type: Number,
          required: [true, "A product must inform how many of this item comes inside of the box."],
        },

        item: {
          type: String,
          trim: true,
          required: [true, "A product must inform what comes inside of the box."],
        },
      },
    ],
  },
  { versionKey: false }
);

// productSchema.virtual("discount").get(function () {
//   return this.price - 20;
// });

// document middleware: runs before save() and create()
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    replacement: "-",
  });
  next();
});

productSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  this.new = true;
  next();
});

const Product = model<ProductProps, ProductsModel>("Product", productSchema);

export default Product;
