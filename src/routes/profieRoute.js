const express = require("express");
const profileRouter = express.Router(); // Initialize a router instance for profile-related routes

// 🧠 Controller Import
const { authorization } = require("../controllers/authorization"); // Middleware to protect routes
const { profileView, profileUpdate } = require("../controllers/profile"); // Profile view/update logic

// GET /profileView — Fetches the user's profile
// ✅ Requires Authorization Middleware
profileRouter.get("/profile/profileView", authorization, profileView);

// PATCH /profileUpdate — Allows user to update their profile details
// ✅ Requires Authorization Middleware
profileRouter.patch("/profile/profileUpdate", authorization, profileUpdate);

module.exports = profileRouter;
