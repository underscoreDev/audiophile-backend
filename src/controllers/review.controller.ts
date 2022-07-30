import { Request, Response } from "express";
import Reviews from "../models/reviews.model";

export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await Reviews.find();
  res.status(200).json({ status: "success", results: reviews.length, data: { reviews } });
};

export const createReview = async (req: Request, res: Response) => {
  const { review, rating, product } = req.body;
  const newReview = await Reviews.create({ review, rating, product, user: req.body.user._id });
  res.status(201).json({ status: "Review Added Successfully", data: { review: newReview } });
};
