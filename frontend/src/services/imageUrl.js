const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_ORIGIN}${imagePath}`;
};

