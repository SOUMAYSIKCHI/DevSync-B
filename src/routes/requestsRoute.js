
const express = require("express");
const reqRouter = express.Router(); // Initialize a dedicated router for connection request operations

// 🧠 Controller Imports
const { authorization } = require("../controllers/authorization"); // Middleware to authorize users
const { statusReq, reviewReq } = require("../controllers/connectionReq"); // Request action handlers

//to send request
reqRouter.post("/request/send/:status/:toUserId", authorization, statusReq);
reqRouter.post("/request/review/:status/:requestId", authorization, reviewReq);

module.exports = reqRouter;
