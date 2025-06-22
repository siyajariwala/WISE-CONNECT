import mongoose from "mongoose";

export const connectDb = async () =>{
try{
const conn =await mongoose.connect(process.env.MONGO_URL);
console.log(`MongoDB connected : ${conn.connection.host}`);
}catch(error){
console.log("Error in connecting mongodb ",error);
process.exit(1);
}
}