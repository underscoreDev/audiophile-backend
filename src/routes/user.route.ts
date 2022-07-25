import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getAllUsers } from "../controllers/user.controller";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { signUp, login, resetPassword, forgotPassword } from "../controllers/auth.controller";

const usersRouter = Router();

usersRouter.route("/login").post(catchAsync(login));
usersRouter.route("/signup").post(catchAsync(signUp));
usersRouter.route("/forgot-password").patch(catchAsync(forgotPassword));
usersRouter.route("/").get(catchAsync(protect), catchAsync(getAllUsers));
usersRouter.route("/reset-password/:reset_id").get(catchAsync(resetPassword));

export default usersRouter;
