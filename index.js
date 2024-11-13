import express from "express";
const app = express();

import cors from "cors";
import morgan from "morgan";

import dotenv from "dotenv";
import connectDb from "./db/dbconnect.js";
dotenv.config();

const PORT = process.env.PORT | 8080;

// DB connection
await connectDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.get("/", (req, res) => {
  res.send(`<h1>Hello home</h1>`);
});

app.get("/api", (req, res) => {
  res.send(`The current time is ${new Date().toLocaleTimeString()}`);
});

// running server on a port
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
