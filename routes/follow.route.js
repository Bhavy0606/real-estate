import express from "express";
import {
  acceptFollowRequest,
  getFollowRequests,
  rejectFollowRequest,
  //   acceptFollowRequest,
  // getFollowRequest,
  sendFollowRequest,
} from "../controllers/follow.controller.js";

const router = express.Router();

router.post("/send-follow-request", sendFollowRequest);
router.get("/get-follow-requests", getFollowRequests);
router.post("/accept-follow-request", acceptFollowRequest);
router.post("/reject-follow-request", rejectFollowRequest);
// router.post("/accept-follow-request", acceptFollowRequest);

export default router;
