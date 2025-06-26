const express = require("express");
const userRoute = express.Router(); 
const Job = require("../models/jobModel");
const { authorization } = require("../controllers/authorization"); 
const { requestReceived, connections, feed } = require("../controllers/userConnection");
userRoute.get("/user/request/received", authorization, requestReceived);
userRoute.get("/user/connections", authorization, connections);
userRoute.get("/user/feed",authorization,feed);
userRoute.get("/user/jobs",authorization,async(req,res)=>{
    try{
        const jobs = await Job.find().sort({ postedDate: -1 }); 
        res.status(200).json(jobs);
    }catch(err){
        console.error('Error fetching jobs:', error.message);
        res.status(500).json({ error: 'Server error while fetching jobs' });
    }
});

module.exports = userRoute;
