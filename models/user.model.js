import mongoose from "mongoose";

// User profile image schema
const userProfileImage = new mongoose.Schema({
  name: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 3,
  },
  profileImage: {
    type: String, // changed from Embedded type to String to store the image path
    required: false, // profile image is optional for the user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;

// export const ProfileImage = mongoose.model("ProfileImage", userProfileImage);
