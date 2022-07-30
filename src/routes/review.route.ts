import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { getAllReviews, createReview } from "../controllers/review.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { roles } from "../interface/user.interface";

const reviewsRouter = Router();

reviewsRouter
  .route("/")
  .get(catchAsync(protect), catchAsync(getAllReviews))
  .post(catchAsync(protect), restrictTo([roles.user]), catchAsync(createReview));

export default reviewsRouter;
