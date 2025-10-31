import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//configurations karni hai middleware set karna hai agar server pe json format  ya objects  format mai data bhejna ho toh

//now it accepts jsm format ka data
app.use(express.json({limit: "16kb"})); 

//jab url se data aata hai so url order mai nahi ho still it should take data from there 
app.use(express.urlencoded({extended: true, limit:"16kb"}))

//to acept pdf files videos voh bhi accept kar sakta hai in public folder
app.use(express.static("public"))

//to put cookies and accept cookies in browser
app.use(cookieParser())
export { app }