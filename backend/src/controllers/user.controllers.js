import FriendRequest from "../models/FriendRequest.js";

import User from "../models/User.js";


export async function getRecommendedUsers(req,res){
try {
    const currentUserId=req.user.id;
    const currentUser=req.user;

    const recommendedUsers=await User.find({
        $and:[
            {_id:{$ne: currentUserId}},             //exclude user themselves
            {_id:{$nin:currentUser.friends}} ,     //exclude people who are laready friends
            {isOnboarded:true}                      //suggest people who are onboarded only
        ]
    })
    return res.status(200).json({recommendedUsers});
} catch (error) {
    console.error("Error in getRecommendedUsers controller",error.message);
} return res.status(500).json({message :"Internal server error"});
}

export async function getMyFriends(req,res){
try {
    const user=await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic year fieldOfStudy roleInClub lookingFors" )
return res.status(200).json(user.friends);

} catch (error) {
     console.error("Error in getMyFriends controller",error.message);
}return res.status(500).json({message :"Internal server error"});
}

export async function sendFriendRequest (req,res){
    try {
      const myId=req.user.id;  
      const{id:receipientId}=req.params

      //prevent sending requests to ourselves
      if(myId==receipientId){
        return res.status(400).json({message :"You cannot send request to yourself"});
      }
      const recipient=await User.findById(receipientId)
      if(!recipient){
       return res.status(404).json({message :"Recipient not found"});
      }
      if(recipient.friends.includes(myId)){
return res.status(400).json({message :"You are already friends with this user"});
      }

      const existingRequest=await FriendRequest.findOne({
        $or:[
            {sender:myId,recipient:receipientId},
            {sender:recipient,recipient:myId},
        ],
      });
      if(existingRequest){
        return res.status(400).json({message: "A friend request already exists between you and the user "})
      }
      const FriendRequest=await FriendRequest.create({
        sender:myId,
        recipient:receipientId,
      });
      res.status(201).json(FriendRequest)
    } catch (error)

     {
       console.error("Error in sendFriendRequest controller",error.message);
}return res.status(500).json({message :"Internal server error"});  
}

    export async function acceptFriendRequest(req,res){
        try {
            const{id:requestId}=req.params
            const friendRequest=await FriendRequest.findById(requestId);
            if(!friendRequest){
                return res.status(404).json({message :"Friend request not found"});  
            }
            if(friendRequest.recipient.toString()!=req.user.id){
                return res.status(403).json({message :"You are not authorized to accept the request"});  
            }
            friendRequest.status="accepted",
            await friendRequest.save();
            //add each user to each other's friends array
            await User.findByIdAndUpdate(friendRequest.sender,{
                $addToSet:{friends:friendRequest.recipent},
            });

            await User.findByIdAndUpdate(friendRequest.recipient,{
                $addToSet:{friends:friendRequest.sender},
            });
            res.status(200).json({message:"Friend request accepted"});

                } catch (error) {
                    console.error("Error in acceptFriendRequest controller",error.message);
            return res.status(500).json({message :"Internal server error"});  
        }
}

    export async function getFriendRequests(req,res){
        try {
            const incomingRequests=await FriendRequest.find({
                recipient:req.user.id,
                status:"pending",
            }).populate("sender","fullName,profilePic,fieldOfSutdy,lookingFor");
           
            const acceptedRequests=await FriendRequest.find({
              sender:req.user.id,
                status:"accepted",
            }).populate("recipient","fullName,profilePic");
            res.status(200).json({incomingRequests,acceptedRequests});
        } catch (error) {
            console.error("Error in getPendingFriendRequest controller",error.message);
            return res.status(500).json({message :"Internal server error"});  
        }
}

    export async function getOutgoingFriendReqs(req,res){
        try {
             const outgoingRequests=await FriendRequest.find({
                sender:req.user.id,
                status:"pending",
            }).populate("recipient","fullName,profilePic,fieldOfSutdy,lookingFor");
             res.status(200).json({outgoingRequests});
        } catch (error) {
            console.error("Error in outgoingFriendRequest controller",error.message);
            return res.status(500).json({message :"Internal server error"});  
        }
}