import express, { Request, Response, Application } from "express";

const app: Application = express();

app.get("/", (_req: Request, res: Response) =>
  res.status(200).json({
    message: "success",
    data: "Welcome to Audioplile Backend server",
  })
);

export default app;
