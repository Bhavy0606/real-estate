import express from "express";
const app = express();

import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDb from "./db/dbconnect.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.PORT | 8080;

// DB connection
await connectDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes middleware
app.use("/api", authRoutes);

// routes
app.get("/", (req, res) => {
  res.send(`<h1>Hello home</h1>`);
});

// running server on a port
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
