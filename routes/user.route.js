import express from "express";
import {
  getUserInfo,
  uploadProfileImage,
  updateUserData,
  changePassword,
  getAllUserInfo,
} from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/info", getUserInfo);
router.get("/get-all-user-info", getAllUserInfo);
router.post("/upload-profile", upload.single("image"), uploadProfileImage);
router.patch("/edit-profile", updateUserData);
router.patch("/change-password", changePassword);

export default router;
