// frontend/src/utils/imageUrl.js
// Our backend returns relative paths like "/uploads/images/abc.jpg".
// This helper turns that into a full URL the <img>/<video> tags can actually load,
// and provides a fallback placeholder when no image exists.

const UPLOADS_BASE = import.meta.env.VITE_UPLOADS_URL; // e.g. http://localhost:5000

export const getImageUrl = (path) => {
  if (!path) {
    // A simple inline placeholder so broken images never show the ugly browser "broken image" icon
    return "https://placehold.co/600x400?text=No+Image";
  }
  return `${UPLOADS_BASE}${path}`;
};

export const getVideoUrl = (path) => {
  if (!path) return "";
  return `${UPLOADS_BASE}${path}`;
};