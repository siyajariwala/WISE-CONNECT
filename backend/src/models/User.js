import mongoose from "mongoose"; 
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlenght:6
    },
    bio:{
        type:String,
        default:"",
    },

    profilePic:{
        type:String,
        default:"",
    },
    fieldOfStudy:{
  type: String,
  default: ""
    },

    year:{
  type: String,
  enum: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"],
  default: "Other"
    },

    roleInClub:{
  type: String,
  default: ""
    },

    lookingFor:{
  type: String,
  default: ""
    },

    isOnboarded:{
        type:Boolean,
        default:false,
    },
    friends :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]
},{timestamps:true});           //timestap gives createdAt and updateAt
//pre hook for hashing passwords
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    try {
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
})
const User= mongoose.model("User",userSchema);
export default User;

