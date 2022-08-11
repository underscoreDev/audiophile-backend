import "dotenv/config";
import sharp from "sharp";
import multer from "multer";
import { AppError } from "./handleAppError.middleware";
import { uploadToS3 } from "../utils/awsS3Client.utils";
import { Response, NextFunction, Request } from "express";

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

export const resizeAndUploadTourPhotos = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files.image || !files.productImageGallery) {
    return next();
  }
  console.log(files);

  const Key = `products/product-${req.params.id}-cover`;

  const ContentType = files.image[0].mimetype;

  const Body = await sharp(files.image[0].buffer)
    .resize(2000, 1333)
    .toFormat("webp")
    .webp({ quality: 100 })
    .toBuffer();

  req.body.image = await uploadToS3({ Body, Key, ContentType });

  // uploading multiple files
  req.body.productImageGallery = [];

  await Promise.all(
    files.productImageGallery.map(async (file, index) => {
      const Key = `products/product-${req.params.id}-${index}-productImageGallery`;
      const ContentType = file.mimetype;

      // resize the image
      const Body = await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("webp")
        .webp({ quality: 100 })
        .toBuffer();

      // upload to s3
      const fileUrl = await uploadToS3({ Body, Key, ContentType });

      // save url to database
      req.body.productImageGallery.push(fileUrl);
    })
  );
  next();
};
