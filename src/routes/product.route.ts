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

const productsRouter = Router();

productsRouter.route("/product-stats").get(catchAsync(getProductStats));
productsRouter.route("/").get(catchAsync(getAllProducts)).post(catchAsync(createProduct));

productsRouter.route("/top-5-products").get(aliasTopProducts).get(catchAsync(getAllProducts));

productsRouter
  .route("/:id")
  .get(catchAsync(getOneProduct))
  .patch(catchAsync(updateProduct))
  .delete(catchAsync(deleteProduct));

export default productsRouter;
