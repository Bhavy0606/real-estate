import userModel from "../models/user.model.js";

const getUserInfo = (req, res) => {
  res.status(201).json({
    message: "Success! User info fetched.",
    user: req.user,
  });
};

export { getUserInfo };
