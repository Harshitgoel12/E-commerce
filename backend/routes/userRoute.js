import express from "express";
import {
  loginUser,
  verifyOTP,
  loginAdmin,
  sendOTP,
  logoutUser,
  ResendOTP
} from "../controllers/userController.js";
import auth from "../middleware/adminAuth.js";

const userRouter = express.Router();

// Auth Routes
userRouter.post("/send-otp", sendOTP);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/login", loginUser);
userRouter.post("/admin/login", loginAdmin);
userRouter.post("/logout", auth, logoutUser);
userRouter.post("/resend-otp",ResendOTP)

export default userRouter;

