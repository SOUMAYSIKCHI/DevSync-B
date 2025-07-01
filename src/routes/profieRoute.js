const express = require("express");
const profileRouter = express.Router(); 

const { authorization } = require("../controllers/authorization");
const { profileView, profileUpdate } = require("../controllers/profile"); 

profileRouter.get("/profile/profileView", authorization, profileView);

profileRouter.patch("/profile/profileUpdate", authorization, profileUpdate);

module.exports = profileRouter;
