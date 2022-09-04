import { Router } from "express";
import { frontendVerifyCookie } from "../middlewares/auth.middleware";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import {
  confirmEmail,
  signUp,
  resendEmailConfirmationToken,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "./../controllers/auth.controller";

const authRouter = Router();

// VERIFY COOKIE FROM THE FRONTEND

authRouter.route("/verify-cookie").get(catchAsync(frontendVerifyCookie));

// REGISTER USER
authRouter.route("/register").post(catchAsync(signUp));

// CONFIRM EMAIL
authRouter.route("/confirm-email/:confirm_token").get(catchAsync(confirmEmail));

// RESEND CONFIRMATION CODE
authRouter.route("/resend-email-confirmation-code").post(catchAsync(resendEmailConfirmationToken));

// LOGIN USER
authRouter.route("/login").post(catchAsync(login));

// LOGOUT USER
authRouter.route("/logout").get(catchAsync(logout));

// FORGOT PASSWORD
authRouter.route("/forgot-password").patch(catchAsync(forgotPassword));

// PASSWORD RESET
authRouter.route("/reset-password").post(catchAsync(resetPassword));

// RESEND FORGOT PASSWORD CODE
authRouter.route("/resend-forgot-password-code").patch(catchAsync(forgotPassword));

export default authRouter;
