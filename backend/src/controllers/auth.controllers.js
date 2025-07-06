import { upsertStreamUser } from "../lib/stream.js";
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
        

      try {
          await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.profilePic ||"",
        });
        console.log(`Stream user created for ${newUser.fullName}`);
      } catch (error) {
        console.log("error creating stream user:",error)
;      }


//creating token 

        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

   //sending/setting cookie in the client's browser     
        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 *60 * 1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })
        res.status(200).json({success:true,user:newUser})
    
        
    } catch (error) {
        console.log("Error in Signupp",error);
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

export async function login(req,res){
 try {
    const{email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields required"})
    }
    const user=await User.findOne({email});
    if (!user) return res.status(401).json({message:"Invalid email or password"});
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({message:"Invalid email or password"});
       const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })
        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 *60 * 1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production"
        })
        res.status(200).json({success:true,user})
 } catch (error) {
     console.log("Error in login contoller",error);
        res.status(500).json({message:"Internal Server Error"});
 }
}

export function logout(req,res){
    res.clearCookie("jwt")
     res.status(200).json({success:true,message:"Logout successfull"});

}

export async function onboard(req ,res){
    try {
        const userId=req.user._id
        const {fullName,bio,fieldOfStudy,year,roleInClub,lookingFor}=req.body
        if(!fullName || !bio || !fieldOfStudy || !year || !roleInClub || !lookingFor){
            return res.status(400).json(
                {message:"All fields required",
                    missingFields:[
                        !fullName && "fullName",
                        !bio && "bio",
                        !fieldOfStudy && "fieldOfSudy",
                        !year && "year",
                        !roleInClub && "roleInClub",
                        !lookingFor && "lookingFor",
                    ].filter(Boolean),

                
                });
        }
       const updatedUser= await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true,
        },{new:true})
        if(!updatedUser) return res.status(404).json({message:"User not found"})
              try {
                await upsertStreamUser({

                id:updatedUser._id.toString(),
                name:updatedUser.fullName,
                image:updatedUser.profilePic || "",   
                })
                console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
              } catch (streamError) {
                console.log("Error u[dating Stream user during onboarding:",streamError.message);
              }
           res.status(200).json({success:true,user:updatedUser}); 
    } catch (error) {
        console.error("Onboarding error:",error);
        res.status(500).json({message :"Internal server error"});
    }
}