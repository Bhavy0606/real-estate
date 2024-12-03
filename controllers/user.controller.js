import multer from "multer";
import User from "../models/user.model.js";
import { getPassword, getUser } from "../services/user.service.js";
import { comparePassword, hashPassword } from "../services/auth.service.js";

// Get user data
const getAllUserInfo = async (req, res) => {
  try {
    // Assuming the current user's ID is provided in `req.user.id`
    const currentUserId = req.user.id;

    // Fetch all users excluding the current user and exclude the `hashedPassword` field
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      { hashedPassword: 0 } // Exclude the hashedPassword field
    );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};
// Get user data
const getUserInfo = async (req, res) => {
  const _id = req.user._id;
  const user = await User.findById({ _id }, { hashedPassword: 0, __v: 0 });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(201).json({
    message: "Success! User info fetched.",
    user,
  });
};

// Controller function to upload user profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { filename } = req.file;
    const filePath = `/uploads/${filename}`; // Store the file path

    // Find the user in the database
    const user = await User.findById(req.user._id); // Ensure user is authenticated and logged in
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the image path in the database
    user.profileImage = filePath;
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile image uploaded successfully", filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit user data
const updateUserData = async (req, res) => {
  try {
    console.log("updating user data");
    const user = await getUser(req.user._id);

    const updates = req.body;
    console.log(user);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    const { hashedPassword } = await getPassword(req.user._id);

    if (!newpassword) {
      return res.status(404).json({ message: "new password not found" });
    }

    const isPasswordMatched = await comparePassword(
      oldpassword,
      hashedPassword
    );

    if (!isPasswordMatched) {
      return res.status(500).json({ message: "Old Password did not matched" });
    }

    if (isPasswordMatched) {
      console.log(newpassword);
      const updates = {
        hashedPassword: await hashPassword(newpassword),
      };
      console.log(updates);

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Unable to update password. try again" });
      }

      if (updatedUser) {
        return res.status(200).json({
          message: "Password successfully updated",
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllUserInfo,
  getUserInfo,
  uploadProfileImage,
  updateUserData,
  changePassword,
};
