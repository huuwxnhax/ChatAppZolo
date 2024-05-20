import express from 'express';
import { loginUser, registerUser, registerUserWithOTP, sendOtpByEmail } from '../controllers/AuthController.js';

const router = express.Router()


// router.post('/register', registerUser)
router.post('/register', registerUserWithOTP)
router.post('/send-otp', sendOtpByEmail)
router.post('/login', loginUser)

export default router