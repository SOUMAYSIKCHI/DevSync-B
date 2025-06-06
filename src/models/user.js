const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
    index: true,
  },
  lastName: { 
    type: String, 
    maxLength: 30, 
    trim: true 
  },
  emailId: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Invalid email format.",
    },
  },
  password: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    min: 10, 
    max: 80 
  },
  gender: {
    type: String,
    lowercase: true,
    validate: {
      validator: (value) => !value || ["male", "female", "others"].includes(value),
      message: "Gender must be 'male', 'female', or 'others'.",
    },
  },
  linkdlnUrl:{
    type:String,
     default: "",
    validate:{
      validator: (value) => !value || value === "" || validator.isURL(value),
      message: "Invalid Linkdln URL",
    }
  },
   GithubUrl:{
    type:String,
     default: "",
    validate:{
      validator: (value) => !value || value === "" || validator.isURL(value),
      message: "Invalid Github URL",
    }
  },
  avatarUrl: {
    type: String,
    default: "",
  },
  galleryUrls: {
    type: [String],
    default: function() {
      return new Array(6).fill("");
    },
    validate: {
      validator: function(arr) {
        // Ensure array has exactly 6 elements
        if (arr.length !== 6) return false;
               
      },
      message: "Gallery must contain exactly 6 elements, each being either empty string or valid URL.",
    },
  },
  about: {
    type: String,
    default: "Hello, Everyone",
    trim: true,
    maxLength: 200,
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: (value) =>
        value.length <= 5 && value.every((skill) => skill.length <= 12),
      message:
        "Skills array should not exceed 5 items, and each must be <= 12 characters.",
    },
  },
}, {
  timestamps: true // Add createdAt and updatedAt timestamps
});

// Pre-save middleware to ensure galleryUrls always has 6 elements
userSchema.pre('save', function(next) {
  if (this.galleryUrls) {
    // Ensure exactly 6 elements
    while (this.galleryUrls.length < 6) {
      this.galleryUrls.push("");
    }
    if (this.galleryUrls.length > 6) {
      this.galleryUrls = this.galleryUrls.slice(0, 6);
    }
  } else {
    this.galleryUrls = new Array(6).fill("");
  }
  next();
});

// Instance method to get non-empty gallery URLs with their indices
userSchema.methods.getActiveGalleryImages = function() {
  return this.galleryUrls
    .map((url, index) => ({ url, index }))
    .filter(item => item.url && item.url !== "");
};

// Instance method to update a specific gallery image
userSchema.methods.updateGalleryImage = function(index, url) {
  if (index >= 0 && index < 6) {
    this.galleryUrls[index] = url || "";
  }
};

module.exports = mongoose.model("User", userSchema);