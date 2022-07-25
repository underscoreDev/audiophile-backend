import { Router } from "express";
import {
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductStats,
} from "../controllers/product.controller";
import { catchAsync } from "../middlewares/catchAsyncError.middleware";
import { aliasTopProducts } from "../middlewares/product.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { roles } from "../interface";

const productsRouter = Router();

productsRouter.route("/product-stats").get(catchAsync(getProductStats));
productsRouter.route("/").get(catchAsync(getAllProducts)).post(catchAsync(createProduct));

productsRouter.route("/top-5-products").get(aliasTopProducts).get(catchAsync(getAllProducts));

productsRouter
  .route("/:product_id")
  .get(catchAsync(getOneProduct))
  .patch(catchAsync(updateProduct))
  .delete(catchAsync(protect), restrictTo([roles.admin, roles.manager]), catchAsync(deleteProduct));

export default productsRouter;
