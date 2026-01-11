import mongoose, { Schema } from "mongoose";

const subscriptionSchema= new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, //one who is subscribing 
        ref: "User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId, //one to who the subscriber is subscribing but it ia also a user 
        ref: "User"
    }
},{timestamps: true})

export const Subscription=mongoose.model("Subscription",subscriptionSchema)