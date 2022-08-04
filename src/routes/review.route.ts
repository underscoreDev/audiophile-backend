import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
} from "../controllers/review.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { roles } from "../interface/user.interface";

const reviewsRouter = Router({ mergeParams: true });

reviewsRouter
  .route("/")
  .get(catchAsync(protect), catchAsync(getAllReviews))
  .post(catchAsync(protect), restrictTo([roles.user]), catchAsync(createReview));

reviewsRouter.route("/:id").delete(catchAsync(deleteReview)).patch(catchAsync(updateReview));

export default reviewsRouter;
