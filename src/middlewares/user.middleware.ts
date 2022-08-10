import multer from "multer";
import { Request, NextFunction, Response } from "express";
import { AppError } from "./handleAppError.middleware";
import sharp from "sharp";

// const multerStorage = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb) => {
//     cb(null, "images/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, Please upload an Image File", 400));
  }
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter: multerFilter });

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }
    req.file.filename = `user-${req.user._id}-${Date.now()}`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`images/users/${req.file.filename}.jpeg`);
    next();
  } catch (error) {
    throw new AppError(`Couldn't resize image ${error}`, 400);
  }
};
