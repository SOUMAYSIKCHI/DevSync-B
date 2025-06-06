const express = require("express");
const authRouter = express.Router();
const rateLimit = require("express-rate-limit");

const { start, login, signup, logout, verifyOTP,verifySignupToken,resetPass,verifyResetOTP } = require("../controllers/authentication");


const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later."
});

const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many signup attempts, please try again later."
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many OTP verification attempts, please try again later."
});
const resetPassLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many password reset attempts, please try again later."
});

authRouter.post("/login", loginLimiter, login);
authRouter.post("/signup/start", start);
authRouter.post("/signup/verify-otp", otpLimiter, verifyOTP);
authRouter.post("/signup", verifySignupToken,signup);
authRouter.post("/reset",resetPassLimiter,resetPass);
authRouter.post("/reset/verify",verifyResetOTP);


authRouter.post("/logout", logout);

module.exports = authRouter;
