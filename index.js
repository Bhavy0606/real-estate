import express from "express";
const app = express();

import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDb from "./db/dbconnect.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import authGuard from "./middlewares/auth.middleware.js";
dotenv.config();

const PORT = process.env.PORT | 8080;

// DB connection
await connectDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Use cookie-parser
app.use(cookieParser());

// Routes middleware
app.use("/api", authRoutes);

// routes
app.get("/", (req, res) => {
  res.send(`<h1>Hello home</h1>`);
});

app.use("/user", authGuard, userRoutes);

app.get("/about", authGuard, (req, res) => {
  res.send(`<h1>Hello about</h1>`);
});

// running server on a port
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
