import express from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
  registerUserWithOTP,
  sendOtpByEmail,
} from "../controllers/AuthController.js";

const router = express.Router();

// router.post('/register', registerUser)
router.post("/register", registerUserWithOTP);
router.post("/send-otp", sendOtpByEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

export default router;
