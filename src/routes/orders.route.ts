import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getUserOrder } from "../controllers/orders.controller";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { getCheckoutsession } from "../controllers/flutterwave.controller";

const ordersRouter = Router();

ordersRouter.route("/checkout-session").post(catchAsync(protect), catchAsync(getCheckoutsession));

// ordersRouter.route("/").post(catchAsync(protect), catchAsync(createOrder));

ordersRouter.route("/my-orders").get(catchAsync(protect), catchAsync(getUserOrder));

export default ordersRouter;
