import mongoose from "mongoose";

const connectDb = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log("DB connection error:", err));
};

export default connectDb;
