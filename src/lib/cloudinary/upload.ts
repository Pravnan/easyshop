import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function uploadImage(
  file: File,
  folder: string = "easyshop"
): Promise<{ url: string; publicId: string } | null> {
  if (!isCloudinaryConfigured) {
    console.warn("Cloudinary not configured. Skipping image upload.");
    return null;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
      },
      (error, result) => {
        if (error) reject(new Error("Image upload failed"));
        else if (result) resolve({ url: result.secure_url, publicId: result.public_id });
        else reject(new Error("Image upload returned no result"));
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Silent fail - image deletion is best effort
  }
}
