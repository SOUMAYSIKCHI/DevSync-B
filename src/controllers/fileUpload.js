const cloudinary = require("cloudinary").v2;
const mime = require("mime-types"); 
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { 
    folder, 
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
  };
  if (quality) options.quality = quality;
  
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

const imageUpload = async (file) => {
  try {
    if (Array.isArray(file)) {
      console.warn("🟡 Multiple files received, using the first one.");
    file = file[0];
    }

    const supportedTypes = ["jpg", "jpeg", "png", "webp", "gif"];
   
    let fileType = "";

    const fileName = file.name || file.tempFilePath || "";
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex !== -1 && lastDotIndex < fileName.length - 1) {
      fileType = fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    
    if (!fileType && file.mimetype) {
      fileType = mime.extension(file.mimetype);
    }

    if (!supportedTypes.includes(fileType)) {
      throw new Error(`File format '${fileType}' not supported. Supported formats: ${supportedTypes.join(', ')} in fileUpload file`);
    }

    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum allowed size is 5MB");
    }

    const response = await uploadFileToCloudinary(file, "Devsync");
    return response;
  } catch (err) {
    console.error("Image upload failed:", err.message);
    throw new Error(`Image upload failed: ${err.message}`);
  }
};


const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);   
    return result;
  } catch (error) {
    console.error(`Failed to delete image ${publicId}:`, error.message);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// Function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  try {
    if (!url || typeof url !== 'string') {
      return null;
    }

    
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    const pathParts = pathname.split('/');
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      console.error("Invalid Cloudinary URL format - no 'upload' segment found");
      return null;
    }

    let relevantParts = pathParts.slice(uploadIndex + 1);
    
    if (relevantParts.length > 0 && /^v\d+$/.test(relevantParts[0])) {
      relevantParts = relevantParts.slice(1);
    }
    
    if (relevantParts.length === 0) {
      console.error("Invalid Cloudinary URL format - no public ID found");
      return null;
    }
    
    const publicIdWithExtension = relevantParts.join('/');
    const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
    
    const publicId = lastDotIndex !== -1 
      ? publicIdWithExtension.substring(0, lastDotIndex)
      : publicIdWithExtension;
    
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error.message);
    return null;
  }
};

const validateImageUrl = (url) => {
  if (!url || url === "") return true; 
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
};

module.exports = { 
  imageUpload, 
  deleteImageFromCloudinary, 
  extractPublicIdFromUrl,
  validateImageUrl 
};