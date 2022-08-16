import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getCheckoutsession } from "../controllers/orders.controller";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";

const ordersRouter = Router();

ordersRouter
  .route("/checkout-session/:productId")
  .get(catchAsync(protect), catchAsync(getCheckoutsession));

ordersRouter.route("/").post(catchAsync(protect));
export default ordersRouter;
