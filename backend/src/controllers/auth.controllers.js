import User from "../models/User.js";
import jwt from "jsonwebtoken";
export async function signup (req,res){
    const {fullName, email, password}=req.body;

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length <6){
            return res.status(400).json({message:"Password must be atleast 6 characters long "});
        }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

    const exisitngUser = await User.findOne({email});
        if(exisitngUser){
            return res.status(400).json({ message: "Email already exists" });
        }
    
        const idx=Math.floor(Math.random()*100 )+1;             //generate number between 1-100
        const randomAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${idx}`

        const newUser= await User.create({
fullName,
            email,
            password,
            profilePic:randomAvatar,
        })
        

        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })
        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 *60 * 1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })
        res.status(201).json({success:true,user:newUser})
    
        
    } catch (error) {
        console.log("Error in Signupp",error);
        res.status(500).json({message:"Internal Servver Error"});
        
    }
}

export async function login(req,res){
    res.send("Login Route");
}

export function logout(req,res){
    res.send("Logout Route");
}