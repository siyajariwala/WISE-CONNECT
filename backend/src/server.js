import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app=express();
const PORT =process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on this port ${PORT}`);
    connectDb();
});