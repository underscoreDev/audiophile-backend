import Product from "../models/product.model";
import { Request, Response } from "express";
import { MongooseQueryParser } from "mongoose-query-parser";
import {
  deleteHandler,
  createHandler,
  updateHandler,
  getOneHandler,
} from "./handlerFactory.controller";

export const getAllProducts = async (req: Request, res: Response) => {
  const parser = new MongooseQueryParser();
  const parsed = parser.parse(req.query);
  const skip = (+parsed.filter.page - 1) * Number(parsed.limit);

  const products = await Product.find(parsed.filter)
    .sort(parsed.sort)
    .select(parsed.select)
    .skip(skip)
    .limit(Number(parsed.limit))
    .select("-features")
    .select("-slug")
    .select("-description")
    .select("-productImageGallery")
    .select("-includedItems")
    .select("-ratingsQuantity")
    .select("-quantity");

  return res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
  });
};

export const getProductStats = async (_req: Request, res: Response) => {
  const stats = await Product.aggregate([
    { $match: { price: { $gte: 500 } } },
    {
      $group: {
        _id: { $toUpper: "$category" },
        numProducts: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  return res.status(200).json({ status: "success", data: { stats } });
};

export const getOneProduct = getOneHandler(Product, { path: "reviews" });
export const createProduct = createHandler(Product);
export const updateProduct = updateHandler(Product);
export const deleteProduct = deleteHandler(Product);
