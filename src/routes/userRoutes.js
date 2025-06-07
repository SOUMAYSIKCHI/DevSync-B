// 📦 Required Modules
const express = require("express");
const userRoute = express.Router(); // Initialize router instance for user-specific endpoints
// 🧠 Controller Imports
const { authorization } = require("../controllers/authorization"); // Middleware to secure user-specific routes
const { requestReceived, connections, feed } = require("../controllers/userConnection"); // Controller functions


userRoute.get("/user/request/received", authorization, requestReceived);

userRoute.get("/user/connections", authorization, connections);

userRoute.get("/user/feed",authorization,feed);

module.exports = userRoute;
