import mongoose from "mongoose";

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
  followers: [
    {
      requestId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
      },
      followerId: {
        type: mongoose.Schema.Types.ObjectId, // Ensures it refers to a `User` by ID
        ref: "User", // Reference to the `User` model
        required: true,
      },
      status: {
        type: String,
        enum: ["ACCEPTED", "NOT_ACCEPTED", "REMOVED"], // Restricts the values for `status`
        default: "NOT_ACCEPTED", // Default status for a new follow request
      },
    },
  ],
  following: [
    {
      requestId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
      },
      followerId: {
        type: mongoose.Schema.Types.ObjectId, // Ensures it refers to a `User` by ID
        ref: "User", // Reference to the `User` model
        required: true,
      },
      status: {
        type: String,
        enum: ["ACCEPTED", "PENDING", "DELETED"], // Restricts the values for `status`
        default: "PENDING", // Default status for a new follow request
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
