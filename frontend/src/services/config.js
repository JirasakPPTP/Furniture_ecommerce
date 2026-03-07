export const API_URL =
  import.meta.env.VITE_API_URL || "https://furniture-ecommerce-6242.onrender.com/api";

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
