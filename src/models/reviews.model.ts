import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";
import { ReviewProps } from "../interface/review.interface";

export type ReviewsModel = Model<ReviewProps, {}, {}>;

const reviewSchema = new Schema<ReviewProps, ReviewProps, {}>({
  review: {
    type: String,
    trim: true,
    required: [true, "A review cannot be empty"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: [true, "Review must belong to a product"],
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
});

const Reviews = model<ReviewProps, ReviewProps>("Reviews", reviewSchema);

export default Reviews;
