//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

//async fuction so returning a promise

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port ${process.env.PORT}`)
    })
})
.catch((error)=>{
console.log("MongoDB connetion failed !!! ",error)
})



/*import express from 'express'

const app=express()
/*function connectDB(){}

connectDB();

//method which uses iife

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(err)=>{
            console.log("Error!!! ",err);
            throw err
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("Error: ", error)
        throw error
    }
})()*/