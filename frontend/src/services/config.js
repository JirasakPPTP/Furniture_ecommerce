export const API_URL =
  import.meta.env.VITE_API_URL || "https://backend-production-b701.up.railway.app/api";

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
