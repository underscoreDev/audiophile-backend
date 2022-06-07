import Product from "../models/product.model";
import { NextFunction, Request, Response } from "express";
import { MongooseQueryParser } from "mongoose-query-parser";

export const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.select = "name,price,ratingsAverage,features,description";
  next();
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const parser = new MongooseQueryParser();
  try {
    const parsed = parser.parse(req.query);
    const skip = (+parsed.filter.page - 1) * Number(parsed.limit);

    const products = await Product.find(parsed.filter)
      .sort(parsed.sort)
      .select(parsed.select)
      .skip(skip)
      .limit(Number(parsed.limit));

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
    next();
  } catch (error: any) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const getOneProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { product },
    });
    next();
  } catch (error: any) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: { product: newProduct },
    });
    next();
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error,
    });
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: { product },
    });
    next();
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
    next();
  } catch (error: any) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};
