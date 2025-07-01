const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const adminRoute = express.Router();
const { authorization } = require("../controllers/authorization");
const Job = require("../models/jobModel");

adminRoute.post("/admin/updateJob", authorization, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this route.",
    });
  }

  try {
    const jobData = req.body;

    const requiredFields = [
      "company", "title", "location", "jobType",
      "eligibleBatch", "skillsRequired", "salary", "description", "applyNow"
    ];

    for (const field of requiredFields) {
      if (!jobData[field]) {
        return res.status(400).json({ success: false, message: `Missing: ${field}` });
      }
    }

    const newJob = new Job({ ...jobData });
    const savedJob = await newJob.save();


    return res.status(201).json({
      success: true,
      message: "Job posted and email broadcasted successfully.",
      data: savedJob,
    });
  } catch (err) {
    console.error("Job save or mail error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
});

module.exports = adminRoute;
