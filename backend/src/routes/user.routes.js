import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import {getMyFriends,getRecommendedUsers,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendReqs} from "../controllers/user.controllers.js";
const router=express.Router();
router.use(protectRoute)            //applying auth middleware to all routes
router.get("/",getRecommendedUsers)
router.get("/",getMyFriends)
router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-requests",getFriendRequests)

router.get("/outgoing-friend-requests",getOutgoingFriendReqs);

export default router;