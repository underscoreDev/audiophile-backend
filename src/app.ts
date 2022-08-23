import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import usersRouter from "./routes/user.route";
import ordersRouter from "./routes/orders.route";
import reviewsRouter from "./routes/review.route";
import mongoSanitize from "express-mongo-sanitize";
import productsRouter from "./routes/product.route";
import { flwWebhook } from "./controllers/flutterwave.controller";
import express, { Request, Response, Application } from "express";
import { AppError } from "./middlewares/handleAppError.middleware";
import { globalErrorHandler } from "./controllers/handleAppError.controller";

const app: Application = express();

// USE CORS
app.use(cors({ origin: "http://localhost:3000" }));
app.options("*", cors);

// Set security HTTP headers
app.use(helmet());

// logging middleware
process.env.NODE_ENV !== "production" && app.use(morgan("dev"));

// rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this Ip Address, Try after some time",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));

// cookie-parser
app.use(cookieParser());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// prevent xss attacks
app.use(xss());

// prevent parameter pollution
app.use(hpp());

// COMPRESSION
app.use(compression());

// FLUTTERWAVE WEBHOOK
app.post("/flw-checkout", express.raw({ type: "application/json" }), flwWebhook);

// API Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/products", productsRouter);
app.get("/api/v1", (_req: Request, res: Response) =>
  res.status(200).json({ message: "success", data: "Welcome to Audioplile Backend server" })
);

// Invalid Routes / not found route error handler
app.all("*", (req, _res, next) =>
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 400))
);

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
