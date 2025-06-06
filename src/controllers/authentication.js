const { ValidSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const OTP = require("../models/OTP");
require("dotenv").config();

const start = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!validator.isEmail(emailId)) {
      return res.status(422).json({
      success: false,
      message: "Email format invalid	"
    });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({
      success: false,
      message: "User already exists."
    });
    }

    // Generate and save OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ emailId, otp }); // Triggers sendVerification()

    return res.status(200).json({
      success: true,
      message: "OTP sent to email.",
      emailId,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    if (!emailId || !otp) {
      return res.status(400).json({
        success: false,
        message: "EmailId and OTP are required." });
    }

    const recentOTP = await OTP.findOne({ emailId }).sort({ createdAt: -1 }).limit(1);

    if (!recentOTP || recentOTP.otp !== otp) {
      return res.status(400).json({success: false, message: "Invalid or expired OTP." });
    }

    // OTP valid — delete all OTPs for this email for security
    await OTP.deleteMany({ emailId });

    // Sign token with emailId key for consistent verification
    const token = jwt.sign({ emailId }, process.env.SECRET_KEY, { expiresIn: "10m" });

    // Set HTTP-only secure cookie with token
    res.cookie("email-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified. Proceed to signup.",
      emailId,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifySignupToken = (req, res, next) => {
  const token = req.cookies["email-token"];
  const tempEmailId = req.body.emailId;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Signup session expired or invalid. Please verify OTP again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (
      typeof tempEmailId !== "string" ||
      tempEmailId.trim().toLowerCase() !== decoded.emailId.trim().toLowerCase()
    ) {
      return res.status(401).json({
        success: false,
        message: "Not a valid Email Id.",
      });
    }

    req.user = { emailId: decoded.emailId };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired signup token.",
    });
  }
};

const signup = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;

    // Validate signup data (implement your validation logic inside ValidSignupData)
    ValidSignupData(req);

    const emailId = req.user.emailId;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    res.clearCookie("email-token");

    return res.status(200).json({ message: "Account created successfully." });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const resetPass = async(req,res) =>{
    try{
        const {emailId} = req.body;
        if(!validator.isEmail(emailId)) {
            throw new Error("Invalid email format.");
        }
        const user = await User.findOne({ emailId });
        if(!user) {
            throw new Error("Email do not exist.Please signup.");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const flag = false;
        await OTP.create({ emailId, otp,flag}); 

        return res.status(200).json({
            success: true,
            message: "OTP sent to email.",
            emailId,
        });

    }catch(e){
        return res.status(400).json({
            success: false,
            message:e.message
        })

    }
}

const verifyResetOTP = async (req, res) => {
    try {
        const { emailId, otp, password } = req.body;

        if (!emailId || !otp || !password) {
            return res.status(400).json({success: false, message: "EmailId, OTP and password are required." });
        }

        const recentOTP = await OTP.findOne({ emailId }).sort({ createdAt: -1 });

        if (!recentOTP || recentOTP.otp !== otp) {
            return res.status(400).json({ success: false,message: "Invalid or expired OTP." });
        }

        if (!validator.isStrongPassword(password)) {
            throw new Error("Enter a strong password.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findOneAndUpdate(
            { emailId },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found during update.");
        }

        await OTP.deleteMany({ emailId }); // Clean up OTPs after use

        return res.status(200).json({
            success: true,
            message: "Password successfully reset.Please Login to continue",
            emailId,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email format.");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Invalid password.");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Email do not exist.Please signup.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Password doesn't match.");
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });

    return res.status(200).json({
      success: true,
      user:user,
      message: "Login successful.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const logout = async (req, res) => {
  res.cookie("user", null, {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};



module.exports = {
  start,
  verifyOTP,
  signup,
  login,
  logout,
  verifySignupToken,
  resetPass,
  verifyResetOTP,
};
