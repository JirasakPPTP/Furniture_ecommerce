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

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export const uploadProductImages = async (files = []) => {
  if (!files.length) return [];

  if (!hasCloudinaryConfig()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Cloudinary is not configured in production. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }
    return files
      .map((file) => file.path || (file.filename ? `/uploads/${file.filename}` : ""))
      .filter(Boolean);
  }

  const folder = process.env.CLOUDINARY_FOLDER || "furniture-ecommerce/products";

  const uploadedUrls = await Promise.all(
    files.map(async (file) => {
      if (file.buffer) {
        const result = await uploadBufferToCloudinary(file.buffer, folder);
        return result.secure_url;
      }

      if (file.path) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder,
          resource_type: "image",
        });
        return result.secure_url;
      }

      throw new Error("Unsupported upload file format");
    })
  );

  return uploadedUrls;
};
