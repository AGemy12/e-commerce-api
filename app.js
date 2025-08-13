import express from "express";
import productRouter from "./routes/products.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import httpStatusText from "./utils/httpStatusText.js";
import usersRouter from "./routes/users.route.js";
import authRouter from "./routes/auth.route.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT;
const url = process.env.MONGODB_URL;

mongoose.connect(url).then(() => {
  console.log("mongodb server started");
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// global middleware for not found routes
app.all("*splat", (req, res, next) => {
  return res.status(400).json({
    status: httpStatusText.ERROR,
    message: "this resource is not available",
  });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(PORT || 4000, () => {
  console.log("server is running on port " + PORT);
});
