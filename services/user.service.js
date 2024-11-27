import User from "../models/user.model.js";

const getUser = async (id) => {
  return await User.findOne({ _id: id }, { hashedPassword: 0, __v: 0 });
};
const getPassword = async (id) => {
  return await User.findOne({ _id: id }, { hashedPassword: 1 });
};

export { getUser, getPassword };
