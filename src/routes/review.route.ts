import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import {
  getAllReviews,
  createReview,
  deleteReview,
  getOneReview,
} from "../controllers/review.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { roles } from "../interface/user.interface";

const reviewsRouter = Router({ mergeParams: true });

// protect all reviews endpoint
reviewsRouter.use(catchAsync(protect));

reviewsRouter
  .route("/")
  .get(catchAsync(getAllReviews))
  .post(restrictTo([roles.user]), catchAsync(createReview));

reviewsRouter
  .route("/:id")
  .delete(restrictTo([roles.admin]), catchAsync(deleteReview))
  .get(restrictTo([roles.manager, roles.admin]), catchAsync(getOneReview));
// .patch(restrictTo([roles.admin]), catchAsync(updateReview))

export default reviewsRouter;
