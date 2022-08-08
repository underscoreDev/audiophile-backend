import { Router } from "express";
import { roles } from "../interface/user.interface";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { getMe, updateUser } from "../controllers/user.controller";
import { logout } from "../controllers/auth.controller";
import {
  getAllUsers,
  updateMe,
  deleteMe,
  deleteUser,
  getUser,
} from "../controllers/user.controller";
import {
  login,
  signUp,
  resetPassword,
  forgotPassword,
  updatePassword,
  confirmEmail,
  resendEmailConfirmationToken,
} from "../controllers/auth.controller";

const usersRouter = Router();

// REGISTER USER
usersRouter.route("/register").post(catchAsync(signUp));

// CONFIRM EMAIL
usersRouter.route("/confirm-email/:confirm_token").get(catchAsync(confirmEmail));

// RESEND CONFIRMATION CODE
usersRouter.route("/resend-email-confirmation-code").post(catchAsync(resendEmailConfirmationToken));

// LOGIN USER
usersRouter.route("/login").post(catchAsync(login));

// LOGOUT USER
usersRouter.route("/logout").get(catchAsync(logout));

// FORGOT PASSWORD
usersRouter.route("/forgot-password").patch(catchAsync(forgotPassword));

// PASSWORD RESET
usersRouter.route("/reset-password").post(catchAsync(resetPassword));

// RESEND FORGOT PASSWORD CODE
usersRouter.route("/resend-forgot-password-code").patch(catchAsync(forgotPassword));

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

usersRouter.route("/me").get(catchAsync(protect), catchAsync(getMe), catchAsync(getUser));

usersRouter
  .route("/:id")
  .delete(catchAsync(protect), restrictTo([roles.admin]), catchAsync(deleteUser))
  .patch(catchAsync(protect), restrictTo([roles.admin]), catchAsync(updateUser))
  .get(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(getUser));

export default usersRouter;
