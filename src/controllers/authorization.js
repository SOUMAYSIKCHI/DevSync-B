const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const authorization = async (req, res, next) => {
  try {
    const token = req.cookies["user"];
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id).select("role emailId");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      _id: decoded._id,
      role: user.role,
      emailId: user.emailId,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { authorization };
