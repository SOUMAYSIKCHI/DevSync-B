const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Contract"],
    required: true,
  },
  eligibleBatch: {
    type: String,
    required: true,
    match: /^[0-9]{4}-[0-9]{4}$/, 
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  salary: {
    type: String,
    required: true,
    validate: {
      validator: (val) => /^₹[0-9]+(-[0-9]+)?\s?LPA$/.test(val),
      message: "Salary format must be like '₹15-25 LPA'",
    },
  },
  description: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  applyNow:{
    type:String,
    required:true,
  }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
