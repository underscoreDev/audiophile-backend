import { Router } from "express";
import { roles } from "../interface";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { aliasTopProducts } from "../middlewares/product.middleware";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import {
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductStats,
} from "../controllers/product.controller";

const productsRouter = Router();

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
  .get(catchAsync(protect), restrictTo([roles.admin, roles.manager]), aliasTopProducts)
  .get(catchAsync(getAllProducts));

// GET ONE, UPDATE AND DELETE PRODUCT
productsRouter
  .route("/:product_id")
  .get(catchAsync(getOneProduct))
  //  Managers and Admins only
  .patch(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(updateProduct))
  .delete(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(deleteProduct));

export default productsRouter;
