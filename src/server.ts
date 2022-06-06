import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";
const { PORT, HOST, DATABASE_LOCAL } = process.env;

const dbConnect = async () => {
  try {
    await mongoose.connect(DATABASE_LOCAL !== undefined ? DATABASE_LOCAL : "");
    console.log("************DATABASE CONNECTED************");
  } catch (error) {
    throw error;
  }
};

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server started on http://${HOST}:${PORT}`);
});
