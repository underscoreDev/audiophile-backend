import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      data: {
        count: products.length,
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
