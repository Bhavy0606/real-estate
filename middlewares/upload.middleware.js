import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import User from "../models/user.model.js";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: async (req, file, cb) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return cb(new Error("User not found"), null);
      }

      const { firstname, lastname } = user;
      let filename = `${firstname}_${lastname}_`;

      // Generate a random 10-digit number
      const randomNumber = crypto.randomBytes(5).toString("hex");
      filename += randomNumber + path.extname(file.originalname);

      const filePath = path.join("uploads", filename);

      // Check if the file already exists
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          return cb(null, filename); // File doesn't exist, proceed with the filename
        }

        // If file exists, generate new filename with additional random string
        return cb(
          null,
          filename +
            "-" +
            crypto.randomBytes(5).toString("hex") +
            path.extname(file.originalname)
        );
      });
    } catch (error) {
      return cb(error, null);
    }
  },
});

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;
