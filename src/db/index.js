import express from  'express'
import { DB_NAME } from '../constants.js'
import mongoose from 'mongoose';

const connectDB= async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB connected!! DB HOST:${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("ERROR: ",error);
        //throw error;
        process.exit(1)
    }
}

export default connectDB;