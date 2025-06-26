const validator = require("validator");

const RESTRICTED_FIELDS = [
  "emailId",
  "password",
];
const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "skills",
  "avatarUrl",
  "galleryUrls",
  "linkdlnUrl",
  "GithubUrl",
  "removedAvatar",
  "removedGalleryIndexes",
];

const profileValidator = (req) => {
  try {
    const requestFields = Object.keys(req.body);

    // Check if any restricted fields are being updated
    const restrictedFieldsInRequest = requestFields.filter((field) =>
      RESTRICTED_FIELDS.includes(field)
    );

    if (restrictedFieldsInRequest.length > 0) {
      console.log(
        `Restricted fields in request: ${restrictedFieldsInRequest.join(", ")}`
      );
      return false;
    }

    // Check if all fields are allowed
    const invalidFields = requestFields.filter(
      (field) => !ALLOWED_FIELDS.includes(field)
    );

    if (invalidFields.length > 0) {
      console.log(`Invalid fields in request: ${invalidFields.join(", ")}`);
      return false;
    }

    // Validate specific field formats
    if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
      console.log("Invalid email format");
      return false;
    }

    if (req.body.age !== undefined) {
      const age = parseInt(req.body.age);
      if (isNaN(age) || age < 12 || age > 80) {
        console.log("Invalid age - must be between 12 and 80");
        return false;
      }
    }

    if (
      req.body.gender &&
      !["male", "female", "others"].includes(req.body.gender.toLowerCase())
    ) {
      console.log("Invalid gender - must be male, female, or others");
      return false;
    }

    if (req.body.firstName !== undefined) {
      if (!req.body.firstName || req.body.firstName.trim().length === 0) {
        console.log("First name cannot be empty");
        return false;
      }
      if (req.body.firstName.length > 50) {
        console.log("First name too long - maximum 50 characters");
        return false;
      }
    }

    if (req.body.lastName !== undefined && req.body.lastName.length > 30) {
      console.log("Last name too long - maximum 30 characters");
      return false;
    }

    if (req.body.about !== undefined && req.body.about.length > 200) {
      console.log("About section too long - maximum 200 characters");
      return false;
    }
    if (typeof req.body.skills === "string") {
      try {
        req.body.skills = JSON.parse(req.body.skills);
      } catch (err) {
        console.log("Invalid JSON in 'skills'");
        return false;
      }
    }

    if (req.body.skills !== undefined) {
      if (!Array.isArray(req.body.skills)) {
        console.log("Skills must be an array");
        return false;
      }
      if (req.body.skills.length > 5) {
        console.log("Too many skills - maximum 5 allowed");
        return false;
      }
      for (const skill of req.body.skills) {
        if (typeof skill !== "string" || skill.length > 20) {
          console.log("Each skill must be a string with maximum 20 characters");
          return false;
        }
      }
    }

    if (
      typeof req.body.avatarUrl === "string" &&
      req.body.avatarUrl.trim() !== "" &&
      !validator.isURL(req.body.avatarUrl)
    ) {
      console.log("Invalid avatar URL format");
      return false;
    }
    if (typeof req.body.galleryUrls === "string") {
      try {
        req.body.galleryUrls = JSON.parse(req.body.galleryUrls);
      } catch (err) {
        console.log("Invalid JSON in 'galleryUrls'");
        return false;
      }
    }

    if (req.body.galleryUrls !== undefined) {
      if (!Array.isArray(req.body.galleryUrls)) {
        console.log("Gallery URLs must be an array");
        return false;
      }
      if (req.body.galleryUrls.length > 6) {
        console.log("Too many gallery URLs - maximum 6 allowed");
        return false;
      }
      for (const url of req.body.galleryUrls) {
        if (
          url !== "" &&
          typeof url === "string" &&
          !url.startsWith("http") &&
          !validator.isURL(url)
        ) {
          console.log("Invalid gallery URL format");
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Profile validation error:", error.message);
    return false;
  }
};

module.exports = profileValidator;
