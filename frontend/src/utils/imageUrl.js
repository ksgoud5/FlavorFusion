// frontend/src/utils/imageUrl.js
// Cloudinary URLs are already complete (e.g. https://res.cloudinary.com/...),
// so we no longer need to prepend a backend base URL. We keep this file
// around as a single centralized place for the "no image" fallback logic,
// so components don't need to change at all — just this one helper.

export const getImageUrl = (path) => {
  if (!path) {
    return "https://placehold.co/600x400?text=No+Image";
  }
  return path; // already a full Cloudinary URL
};

export const getVideoUrl = (path) => {
  return path || ""; // already a full Cloudinary URL, or empty if none
};