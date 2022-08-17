import { Router } from "express";
import { roles } from "../interface/user.interface";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { uploadUserPhoto, resizeUserPhoto } from "../middlewares/user.middleware";

import {
  getAllUsers,
  updateMe,
  deleteMe,
  deleteUser,
  getUser,
  favouriteProducts,
  getMe,
  updateUser,
  addProductTocart,
  removeProductFromCart,
} from "../controllers/user.controller";

import {
  logout,
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

// Protect ALL ROUTES AFTER THIS MIDDLEWARE
usersRouter.use(catchAsync(protect));

// GET ME
usersRouter.route("/me").get(catchAsync(getMe), catchAsync(getUser));

// USER UPDATING THEIR USER INFO (name, email, address)
usersRouter
  .route("/update-me")
  .patch(uploadUserPhoto, catchAsync(resizeUserPhoto), catchAsync(updateMe));

// USER DELETING THEIR ACCOUNT
usersRouter.route("/delete-me").delete(catchAsync(deleteMe));

// USER UPDATING THEIR PASSWORD
usersRouter.route("/update-password").patch(catchAsync(updatePassword));

// GET ALL USERS
usersRouter.route("/").get(restrictTo([roles.admin, roles.manager]), catchAsync(getAllUsers));

usersRouter
  .route("/:id")
  .delete(restrictTo([roles.admin]), catchAsync(deleteUser))
  .patch(restrictTo([roles.admin]), catchAsync(updateUser))
  .get(restrictTo([roles.admin, roles.manager]), catchAsync(getUser));

usersRouter.route("/favourite-products").post(catchAsync(protect), catchAsync(favouriteProducts));
usersRouter.route("/add-to-cart").post(catchAsync(protect), catchAsync(addProductTocart));
usersRouter.route("/remove-from-cart").post(catchAsync(protect), catchAsync(removeProductFromCart));

export default usersRouter;
