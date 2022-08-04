import { Request, Response } from "express";
import Reviews from "../models/reviews.model";
import { deleteHandler, getOneHandler, updateHandler } from "./handlerFactory.controller";

export const getAllReviews = async (req: Request, res: Response) => {
  let filter = {};
  if (req.params.id) {
    filter = { product: req.params.id };
  }
  const reviews = await Reviews.find(filter);
  return res.status(200).json({ status: "success", results: reviews.length, data: { reviews } });
};

export const createReview = async (req: Request, res: Response) => {
  if (!req.body.product) {
    req.body.product = req.params.product_id;
  }
  const { review, rating, product } = req.body;

  const newReview = await Reviews.create({ review, rating, user: req.body.user._id, product });
  res.status(201).json({ status: "Review Added Successfully", data: { review: newReview } });
};

export const getOneReview = getOneHandler(Reviews);
export const updateReview = updateHandler(Reviews);
export const deleteReview = deleteHandler(Reviews);
