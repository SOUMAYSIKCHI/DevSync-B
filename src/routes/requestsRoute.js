const express = require("express");
const reqRouter = express.Router();
const { authorization } = require("../controllers/authorization"); 
const { statusReq, reviewReq } = require("../controllers/connectionReq"); 
reqRouter.post("/request/send/:status/:toUserId", authorization, statusReq);
reqRouter.post("/request/review/:status/:requestId", authorization, reviewReq);

module.exports = reqRouter;

