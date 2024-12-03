import User from "../models/user.model.js";
import FriendRequest from "../models/request.model.js";

const sendFollowRequest = async (req, res) => {
  request_id;
  try {
    const { receiver } = req.body; // Assuming receiverId and note are sent in the request body
    const senderId = req.user._id; // Current user ID from authenticated middleware

    if (senderId === receiver) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself.",
      });
    }

    // Check if a similar request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiver,
      status: { $in: ["PENDING", "ACCEPTED"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists or is pending.",
      });
    }

    // Create a new friend request
    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiver,
    });

    // Save the friend request
    await friendRequest.save();
    // Update the sender's following list
    await User.findByIdAndUpdate(
      senderId,
      {
        $push: {
          following: {
            requestId: friendRequest._id,
            followerId: receiver,
            status: "PENDING",
          },
        },
      },
      { new: true }
    );

    // Update the receiver's followers list
    await User.findByIdAndUpdate(
      receiver,
      {
        $push: {
          followers: {
            requestId: friendRequest._id,
            followerId: senderId,
            status: "NOT_ACCEPTED",
          },
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
      data: friendRequest,
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the friend request.",
      error: error.message,
    });
  }
};

const getFollowRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user._id,
      status: "PENDING",
    });
    if (!requests) {
      res.status(404).json({ message: "Unable to find requests" });
    } else {
      res.status(200).json({
        message: "Requests found.",
        data: requests,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const acceptFollowRequest = async (req, res) => {
  try {
    const { request_id } = req.body; // Friend request ID passed in the request body
    const receiver = req.user._id; // Current user ID from authenticated middleware

    // Find the friend request
    const friendRequest = await FriendRequest.findById(request_id);
    if (!friendRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found." });
    }

    // Check if the current user is the receiver of the request
    if (friendRequest.receiver.toString() !== receiver.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this request.",
      });
    }

    // Update the friend request status to ACCEPTED
    friendRequest.status = "ACCEPTED";
    friendRequest.approvedDate = new Date();
    await friendRequest.save();

    // Update the receiver's followers list
    await User.findByIdAndUpdate(
      receiver,
      {
        $set: { "followers.$[elem].status": "ACCEPTED" }, // Update status of the specific request
      },
      {
        arrayFilters: [{ "elem.requestId": friendRequest._id }], // Match the specific follower request
        new: true,
      }
    );

    // Update the sender's following list
    await User.findByIdAndUpdate(
      friendRequest.sender,
      {
        $set: { "following.$[elem].status": "ACCEPTED" }, // Update status of the specific request
      },
      {
        arrayFilters: [{ "elem.requestId": friendRequest._id }], // Match the specific following request
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully.",
      data: friendRequest,
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while accepting the friend request.",
      error: error.message,
    });
  }
};
const rejectFollowRequest = async (req, res) => {
  try {
    const { request_id } = req.body; // Friend request ID passed in the request body
    const receiver = req.user._id; // Current user ID from authenticated middleware

    // Find the friend request
    const friendRequest = await FriendRequest.findById(request_id);
    if (!friendRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found." });
    }

    // Check if the current user is the receiver of the request
    if (friendRequest.receiver.toString() !== receiver.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this request.",
      });
    }

    // Update the friend request status to REJECTED
    friendRequest.status = "REJECTED";
    friendRequest.deletedDate = new Date();
    await friendRequest.save();

    // Remove the entry from the receiver's followers array
    await User.findByIdAndUpdate(
      receiver,
      {
        $pull: {
          followers: { requestId: friendRequest._id },
        },
      },
      { new: true }
    );

    // Remove the entry from the sender's following array
    await User.findByIdAndUpdate(
      friendRequest.sender,
      {
        $pull: {
          following: { requestId: friendRequest._id },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Follow request rejected successfully.",
    });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the follow request.",
      error: error.message,
    });
  }
};

//  getFollowRequest, acceptFollowRequest

export { sendFollowRequest, getFollowRequests, acceptFollowRequest,rejectFollowRequest };
