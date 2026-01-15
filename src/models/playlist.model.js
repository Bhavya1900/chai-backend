import mongoose from "mongoose";

const playlistSchema= new mongoose.Schema(
    {
        name:{
            type: String,
            req: true
        },
        video:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        description:{
            type: String,
            req: true
        },
        owner:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User" 
        }
        
    },{timestamps: true})

export const Playlsit= mongoose.model("Playlist",playlistSchema)