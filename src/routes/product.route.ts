import { Router } from "express";
import { roles } from "../interface/user.interface";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import {
  aliasTopProducts,
  uploadTourPhotos,
  resizeAndUploadTourPhotos,
} from "../middlewares/product.middleware";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import {
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductStats,
} from "../controllers/product.controller";
import reviewsRouter from "./review.route";

const productsRouter = Router();

//
productsRouter.use("/:product_id/reviews", reviewsRouter);

// Get product stats (can be used for the admin dashboard)
productsRouter
  .route("/product-stats")
  .get(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(getProductStats));

// GET AND CREATE NEW PRODUCTS
productsRouter
  .route("/")
  // Get all products with queries (queries include select,sort, limit, skip )
  .get(catchAsync(getAllProducts))
  // create product, only admins and manager allowed
  .post(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(createProduct));

// GET TOP MOST EXPENSIVE PRODUCTS  (can be used for the admin dashboard)
productsRouter
  .route("/top-5-products")
  .get(
    catchAsync(protect),
    restrictTo([roles.admin, roles.manager]),
    aliasTopProducts,
    catchAsync(getAllProducts)
  );

// GET ONE, UPDATE AND DELETE PRODUCT
productsRouter
  .route("/:id")
  .get(catchAsync(getOneProduct))
  //  Managers and Admins only
  .patch(
    catchAsync(protect),
    restrictTo([roles.admin, roles.manager]),
    uploadTourPhotos,
    catchAsync(resizeAndUploadTourPhotos),
    catchAsync(updateProduct)
  )
  .delete(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(deleteProduct));

export default productsRouter;
