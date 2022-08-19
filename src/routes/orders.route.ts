import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getCheckoutsession, createOrder, getUserOrder } from "../controllers/orders.controller";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";

const ordersRouter = Router();

ordersRouter.route("/checkout-session").post(catchAsync(protect), catchAsync(getCheckoutsession));

ordersRouter.route("/").post(catchAsync(protect), catchAsync(createOrder));

ordersRouter.route("/my-orders").get(catchAsync(protect), catchAsync(getUserOrder));

export default ordersRouter;
