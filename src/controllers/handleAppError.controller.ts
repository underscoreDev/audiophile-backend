import { ErrorRequestHandler, Response } from "express";

const sendDevError = (err: { statusCode: any; status: any; message: any }, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
  });
};

const sendProdError = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error, 🔥🔥🔥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  process.env.NODE_ENV === "development" ? sendDevError(err, res) : sendProdError(err, res);
};
