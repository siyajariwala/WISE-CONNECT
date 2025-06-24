import {StreamChat} from "stream-chat";
import "dotenv/config"
const apiKey =process.env.STREAM_API_KEY
const apiSecret=process.env.STREAM_API_SECRET
if(!apiKey || !apiSecret){
    console.log("STREAM API KEY OR SECRET IS MISSING")
}
const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async (userData)=>{
try {
    await streamClient.upsertUsers([userData]);
    return userData;
} catch (error) {
    console.error("Error upserting stream user",error);
}
};
export const generateStreamToken =(userId)=>{};