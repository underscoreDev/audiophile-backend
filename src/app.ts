import express, { Request, Response, Application } from "express";
import productsRouter from "./routes/product.route";
import usersRouter from "./routes/user.route";

const app: Application = express();

app.use(express.json());

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/users", usersRouter);

app.get("/", (_req: Request, res: Response) =>
  res.status(200).json({
    message: "success",
    data: "Welcome to Audioplile Backend server",
  })
);

export default app;
