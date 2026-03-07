import { API_ORIGIN } from "./config";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_ORIGIN}${imagePath}`;
};
