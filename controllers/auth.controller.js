import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  comparePassword,
  generateJWTToken,
  hashPassword,
} from "../services/auth.service.js";

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne(
    { email },
    {
      _id: 1,
      email: 1,
      firstname: 1,
      lastname: 1,
      hashedPassword: 1,
    }
  );

  if (existingUser) {
    const flag = await comparePassword(password, existingUser.hashedPassword);

    if (flag) {
      const payload = {
        _id: existingUser._id,
        email: existingUser.email,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
      };
      const token = await generateJWTToken(payload);

      return res.json({
        message: "Login successful",
        token,
      });
    } else {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Incorrect password" });
    }
  } else {
    return res
      .status(404)
      .json({ error: "Not found", message: "User does not found." });
  }
};
const handleRegister = async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword, createdAt } =
    req.body;
  try {
    // check if user email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already in use." });

    // check if password and confirm password matches
    if (password !== confirmPassword)
      return res.status(400).json({
        message:
          "Password and confirm password do not match. Please ensure both fields contain the same value.",
      });

    const hashedPassword = await hashPassword(password);

    // Save new user
    const user = new userModel({
      firstname,
      lastname,
      email,
      hashedPassword,
      createdAt,
    });

    await user.save();

    res.json({ message: "Register successful", user });
  } catch (err) {
    console.log(err);
  }
};

export { handleLogin, handleRegister };
