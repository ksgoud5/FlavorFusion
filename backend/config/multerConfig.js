// backend/config/multerConfig.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Instead of multer.diskStorage (local folder), we use CloudinaryStorage —
// files get streamed directly to Cloudinary during the upload request itself.
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Route images and videos into separate Cloudinary folders,
    // mirroring our old uploads/images vs uploads/videos structure —
    // just for organization when browsing your Cloudinary dashboard.
    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder: isVideo ? "flavorfusion/videos" : "flavorfusion/images",
      resource_type: isVideo ? "video" : "image",
      // Cloudinary auto-generates a unique public_id if we don't set one,
      // which is exactly the "guaranteed unique filename" behavior we
      // manually built ourselves back in Step 4 — Cloudinary does it for us now.
      allowed_formats: isVideo
        ? ["mp4", "webm", "mov"]
        : ["jpg", "jpeg", "png", "webp"],
    };
  },
});

// Same fileFilter logic as before — an extra layer of validation
// before the file is even sent to Cloudinary.
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image" || file.fieldname === "profilePicture") {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
    }
  } else if (file.fieldname === "video") {
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only MP4, WEBM, and MOV videos are allowed"), false);
    }
  } else {
    cb(new Error("Unexpected field name"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max, same as before
  },
});

export default upload;