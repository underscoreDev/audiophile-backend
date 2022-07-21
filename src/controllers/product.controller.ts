import Product from "../models/product.model";
import { Request, Response } from "express";
import { MongooseQueryParser } from "mongoose-query-parser";

export const getAllProducts = async (req: Request, res: Response) => {
  const parser = new MongooseQueryParser();
  const parsed = parser.parse(req.query);
  const skip = (+parsed.filter.page - 1) * Number(parsed.limit);

  const products = await Product.find(parsed.filter)
    .sort(parsed.sort)
    .select(parsed.select)
    .skip(skip)
    .limit(Number(parsed.limit));

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

export const getOneProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  return res.status(200).json({ status: "success", data: { product } });
};

export const createProduct = async (req: Request, res: Response) => {
  const newProduct = await Product.create(req.body);
  return res.status(201).json({ status: "success", data: { product: newProduct } });
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(201).json({ status: "success", data: { product } });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  return res.status(204).json({ status: "success", data: null });
};
