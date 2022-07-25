import usersRouter from "./routes/user.route";
import productsRouter from "./routes/product.route";
import express, { Request, Response, Application } from "express";
import { AppError } from "./middlewares/handleAppError.middleware";
import { globalErrorHandler } from "./controllers/handleAppError.controller";

const app: Application = express();

app.use(express.json());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);

app.get("/", (_req: Request, res: Response) =>
  res.status(200).json({
    message: "success",
    data: "Welcome to Audioplile Backend server",
  })
);

app.all("*", (req, _res, next) =>
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 400))
);

app.use(globalErrorHandler);

export default app;
