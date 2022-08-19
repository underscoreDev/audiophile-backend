import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";
const { PORT, HOST, DATABASE_LOCAL } = process.env;

process.on("uncaughtException", (err) => {
  console.log("****** UNCAUGHT EXCEPTION 🔥🔥🔥 SHUTTING DOWN *****");
  console.log(err.name, err.message);
  process.exit(1);
});

const dbConnect = async () => {
  try {
    await mongoose.connect(DATABASE_LOCAL as string);
    console.log("************DATABASE CONNECTED************");
  } catch (error) {
    throw new Error(`Cannot connect to database ${error}`);
  }
};

const server = app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server started on http://${HOST}:${PORT}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("****** UMHANDLED REJECTION 🔥🔥🔥 SHUTTING DOWN *****");
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("****** SIGTERM RECEIVED 🔥🔥🔥 SHUTTING DOWN *****");
  server.close(() => console.log("🔥🔥🔥 process terminated"));
});
