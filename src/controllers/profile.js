const User = require("../models/user");
const profileValidator = require("../utils/profileValidator");
const validator = require("validator");
const { imageUpload } = require("../controllers/fileUpload");

const profileView = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

const profileUpdate = async (req, res) => {
  try {
    if (!profileValidator(req)) {
      throw new Error("Specific field cannot be updated");
    }

    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Remove avatar if marked
    if (req.body.removedAvatar === "true" && loggedInUser.avatarUrl) {
      const publicId = extractPublicIdFromUrl(loggedInUser.avatarUrl);
      if (publicId) await deleteFromCloudinary(publicId);
      loggedInUser.avatarUrl = "";
    }
    if (req.body.removedGalleryIndexes) {
      const removedIndexes = JSON.parse(req.body.removedGalleryIndexes);
      for (const index of removedIndexes) {
        const i = parseInt(index);
        if (!isNaN(i) && loggedInUser.galleryUrls[i]) {
          const publicId = extractPublicIdFromUrl(loggedInUser.galleryUrls[i]);
          if (publicId) await deleteFromCloudinary(publicId);
          loggedInUser.galleryUrls[i] = "";
        }
      }
    }

    // Update non-gallery, non-avatar fields
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    const normalizeFile = (file) => {
      if (Array.isArray(file)) return file[0]; // Take the first one
       return file;
    };


    // Handle avatar upload and deletion of old avatar
    if (req.files?.avatarFile) {
      const file = normalizeFile(req.files.avatarFile); // ✅ normalized
      const oldAvatarUrl = loggedInUser.avatarUrl;
      // Upload new avatar
      const uploadResponse = await imageUpload(file);
      loggedInUser.avatarUrl = uploadResponse.secure_url;

      // Delete old avatar from Cloudinary if it exists
      if (oldAvatarUrl && oldAvatarUrl !== "") {
        try {
          const publicId = extractPublicIdFromUrl(oldAvatarUrl);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        } catch (deleteError) {
        
        }
      }
    }

    // Initialize galleryUrls array if it doesn't exist or ensure it has 6 slots
    if (!loggedInUser.galleryUrls) {
      loggedInUser.galleryUrls = new Array(6).fill("");
    } else {
      // Ensure array has exactly 6 elements
      while (loggedInUser.galleryUrls.length < 6) {
        loggedInUser.galleryUrls.push("");
      }
      if (loggedInUser.galleryUrls.length > 6) {
        loggedInUser.galleryUrls = loggedInUser.galleryUrls.slice(0, 6);
      }
    }

    // Handle gallery image uploads
    const galleryUploadPromises = [];

    for (let i = 0; i < 6; i++) {
      const fileFieldName = `galleryImage${i}`;
      const file = req.files?.[fileFieldName];

      if (file) {
        // New image is being uploaded for this index
        const oldImageUrl = loggedInUser.galleryUrls[i];

        // Upload new image
        const uploadPromise = imageUpload(file).then(async (uploadResponse) => {
          // Delete old image from Cloudinary if it exists
          if (oldImageUrl && oldImageUrl !== "") {
            try {
              const publicId = extractPublicIdFromUrl(oldImageUrl);
              if (publicId) {
                await deleteFromCloudinary(publicId);
              }
            } catch (deleteError) {
              throw new Error(deleteError)
            }
          }
          return uploadResponse.secure_url;
        });

        galleryUploadPromises[i] = uploadPromise;
      } else {
        // No new file for this index, keep existing URL
        galleryUploadPromises[i] = Promise.resolve(
          loggedInUser.galleryUrls[i] || ""
        );
      }
    }

    // Wait for all uploads to complete
    const galleryUrls = await Promise.all(galleryUploadPromises);

    // Update the gallery URLs
    loggedInUser.galleryUrls = galleryUrls;

    // Save the updated user
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Profile update failed: ${error.message}`,
    });
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) return null;

    // Find the part after version (if exists) or after upload
    let publicIdWithExtension = urlParts[urlParts.length - 1];

    // Remove file extension
    const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
    const publicId =
      lastDotIndex !== -1
        ? publicIdWithExtension.substring(0, lastDotIndex)
        : publicIdWithExtension;

    // Include folder path if exists
    const folderParts = urlParts.slice(uploadIndex + 2, -1); // Skip upload and version
    if (folderParts.length > 0 && !folderParts[0].startsWith("v")) {
      return folderParts.join("/") + "/" + publicId;
    }

    return publicId;
  } catch (error) {
    
    return null;
  }
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  const cloudinary = require("cloudinary").v2;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { profileView, profileUpdate };
