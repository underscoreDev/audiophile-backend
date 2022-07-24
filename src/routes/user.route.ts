import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { signUp, login } from "../controllers/auth.controller";

const usersRouter = Router();

usersRouter.route("/").get(getAllUsers);

usersRouter.route("/signup").post(catchAsync(signUp));
usersRouter.route("/login").post(catchAsync(login));

export default usersRouter;
