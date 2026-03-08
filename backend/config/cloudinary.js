import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const hasCloudinaryConfig = () =>
  Boolean(cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret);

if (hasCloudinaryConfig()) {
  cloudinary.config(cloudinaryConfig);
}

const tryDeleteLocalFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore cleanup errors.
  }
};

export const uploadProductImages = async (files = []) => {
  if (!files.length) return [];

  if (!hasCloudinaryConfig()) {
    return files.map((file) => `/uploads/${file.filename}`);
  }

  const folder = process.env.CLOUDINARY_FOLDER || "furniture-ecommerce/products";

  const uploadedUrls = await Promise.all(
    files.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          resource_type: "image",
        });
        return result.secure_url;
      } finally {
        await tryDeleteLocalFile(file.path);
      }
    })
  );

  return uploadedUrls;
};

