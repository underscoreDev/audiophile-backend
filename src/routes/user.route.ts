import { Router } from "express";
import { roles } from "../interface/user.interface";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { getAllUsers, updateMe, deleteMe } from "../controllers/user.controller";
import {
  login,
  signUp,
  resetPassword,
  forgotPassword,
  updatePassword,
} from "../controllers/auth.controller";

const usersRouter = Router();

// REGISTER USER
usersRouter.route("/register").post(catchAsync(signUp));

// LOGIN USER
usersRouter.route("/login").post(catchAsync(login));

// FORGOT PASSWORD
usersRouter.route("/forgot-password").patch(catchAsync(forgotPassword));

// PASSWORD RESET
usersRouter.route("/reset-password/:reset_id").get(catchAsync(resetPassword));

// USER UPDATING THEIR USER INFO (name, email,address)
usersRouter.route("/update-me").patch(catchAsync(protect), catchAsync(updateMe));

// USER DELETING THEIR ACCOUNT
usersRouter.route("/delete-me").delete(catchAsync(protect), catchAsync(deleteMe));

// USER UPDATING THEIR PASSWORD
usersRouter.route("/update-password").patch(catchAsync(protect), catchAsync(updatePassword));

// GET ALL USERS
usersRouter
  .route("/")
  .get(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(getAllUsers));

export default usersRouter;
