import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { login, signup,logout ,onboard} from "../controllers/auth.controllers.js";
const router=express.Router()

router.post("/signup", signup);
router.post("/login",login);
router.post("/logout",logout);

router.post("/onboarding",protectRoute,onboard);


//check if user is logged in or not
router.get("/me",protectRoute,(req , res)=>{
    return res.status(200).json({success:true,user:req.user});
});
export default router;