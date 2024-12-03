import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User collection
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User collection
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"], // Define possible statuses
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation date
  },
  updatedAt: {
    type: Date, // Automatically update when the request status changes
  },
  approvedDate: {
    type: Date, // Only set if the request is accepted
  },
  deletedDate: {
    type: Date, // Set if the request is cancelled or rejected
  },
  note: {
    type: String, // Optional note from the sender
    maxlength: 200, // Limit the note length to 200 characters
  },
});

friendRequestSchema.pre("save", function (next) {
  // Automatically set `updatedAt` whenever the document is modified
  this.updatedAt = new Date();
  next();
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
