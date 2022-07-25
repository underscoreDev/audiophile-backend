import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { signUp, login, resetPassword, forgotPassword } from "../controllers/auth.controller";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { protect } from "../middlewares/auth.middleware";

const usersRouter = Router();

usersRouter.route("/").get(catchAsync(protect), catchAsync(getAllUsers));
usersRouter.route("/signup").post(catchAsync(signUp));
usersRouter.route("/login").post(catchAsync(login));
usersRouter.route("/forgot-password").patch(catchAsync(forgotPassword));
usersRouter.route("/reset-password/:reset_id").get(catchAsync(resetPassword));

export default usersRouter;
