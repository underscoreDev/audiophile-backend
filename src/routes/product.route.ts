import { Request, Response, Router, NextFunction } from "express";
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";

const productsRouter = Router();

// param middleware
productsRouter.param("id", (_req: Request, _res: Response, next: NextFunction, val: string) => {
  console.log(`Product Id is ${val}`);
  next();
});

productsRouter.route("/").get(getAllProducts).post(createProduct);
productsRouter.route("/:id").get(getOneProduct).patch(updateProduct).delete(deleteProduct);

export default productsRouter;
