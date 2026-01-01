import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=express();
//for all middlewares and configurations 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//configurations karni hai middleware set karna hai agar server pe json format  ya objects  format mai data bhejna ho toh
app.use(express.json( {limit: "16kb"}))

//jab url se data aata hai so url order mai nahi ho still it should take data from there 
app.use(express.urlencoded({extended: true, limit:"16kb"}))

//to acept pdf files videos voh bhi accept kar sakta hai in public folder
app.use(express.static("public"))

//to put cookies in users browser from server and accept cookies fro browser
app.use(cookieParser())


//import routes
import UserRouter from "./routes/user.routes.js"

//routes declaration

app.use("/api/v1/users",UserRouter)
//so ab yaha aise hota hia https://localhost:8000/api/v1/users 
export {app}