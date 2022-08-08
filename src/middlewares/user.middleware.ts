import multer from "multer";
import { Request } from "express";
import { AppError } from "./handleAppError.middleware";

const multerStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, Please upload an Image File", 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single("photo");
