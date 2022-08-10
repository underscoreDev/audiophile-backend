import "dotenv/config";
import streamifier from "streamifier";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import { AppError } from "../middlewares/handleAppError.middleware";

const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = (
  image: string | Buffer | Uint8Array
): Promise<UploadApiResponse | undefined> =>
  new Promise((resolve, reject) =>
    streamifier
      .createReadStream(image)
      .pipe(
        cloudinary.uploader.upload_stream({ folder: "products" }, (err, res) =>
          err ? reject(err) : resolve(res)
        )
      )
  );
