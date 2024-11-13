import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send(`<h1>Hello home</h1>`);
});

app.get("/api", (req, res) => {
  res.send(`The current time is ${new Date().toLocaleTimeString()}`);
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
