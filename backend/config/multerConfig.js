// backend/config/multerConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folders exist (in case they were deleted or missing on a fresh clone)
const imageDir = "uploads/images";
const videoDir = "uploads/videos";
[imageDir, videoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Decide WHERE and under WHAT NAME to store each uploaded file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, imageDir);
    } else if (file.fieldname === "video") {
      cb(null, videoDir);
    } else {
      cb(new Error("Unexpected field name"), null);
    }
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: timestamp + original extension
    // Example: 1721300000000-a1b2c3.jpg
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Only allow specific file types, reject everything else
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
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

// Main upload middleware — accepts one image file AND one video file (both optional)
// in a single form submission, under field names "image" and "video"
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max per file (covers short recipe videos)
  },
});

export default upload;