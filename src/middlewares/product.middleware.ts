import multer from "multer";
import { Response, NextFunction, Request } from "express";
import { AppError } from "./handleAppError.middleware";
import "dotenv/config";
import { uploadToCloudinary } from "../utils/cloudinary.util";

export const aliasTopProducts = (req: Request, _res: Response, next: NextFunction) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.select = "name,price,ratingsAverage,features,description";
  next();
};

const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, Please upload an Image File", 400));
  }
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter: multerFilter });

export const uploadTourPhotos = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "productImageGallery", maxCount: 5 },
]);

export const resizeTourPhotos = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files.image || !files.productImageGallery) {
    return next();
  }

  try {
    const uploadedImage = await uploadToCloudinary(files?.image[0].buffer);
    req.body.image = uploadedImage?.secure_url;
    next();
  } catch (error) {
    throw new AppError(`Cant upload ${error}`, 500);
  }
};
