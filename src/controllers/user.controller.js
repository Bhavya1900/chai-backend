import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser=asyncHandler(async(req,res)=>{
     // get user details from frontend(postman se lege)
     //validation all feilds are given by users(not empty)
     // check if user alrady exists -(best practice : check with username or email)
     // check for images, check for avatar
     //if there then upload it to cloudinary
     //user->multer->cloudinary->(we got an url)
     //create user object (nosql database)-create entry in db(db calls)
     // remove password and refresh token feild from response()
     // check for user creation then return response kyuki mongoDb returns everything
     
     const {fullName,username,email,password}=req.body;
     console.log(req.body);
     console.log("email: ",email);
        // if(fullName ===""){
        //     throw new ApiError(400,"fullname is required");
        // } this method for all feilds so sme easy method
        if([fullName,email,username,password].some((feild)=>
            feild?.trim() === ""
        )){
            ApiError(400,"All fields required")
        }

        const existedUser=User.findOne({
            $or:[{username},{email}]
        })

        if(existedUser){
            throw new ApiError(409,"User with email and userName already exist")
        }

        const avatarLocalPath=req.files?.avatar[0]?.path;
         const coverImageLocalPath=req.files?.coverImage[0]?.path;
        if(!avatarLocalPath){
            throw ApiError(400,"Avtar file is required")
        }

        const avatar=await uploadOnCloudinary(avatarLocalPath);
        const coverImage=await uploadOnCloudinary(coverImageLocalPath);

        if(!avatar){
            throw new ApiError(400,"Avatar file is required");
        }

        const user=await User.create({
            fullName,
            avatar:avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })
        const cretedUser=await User.findById(user._id).select(
            "-password -refreshTokens"
        )
        if(!cretedUser){
            throw new ApiError(500,"Something went wrong while registering a user")
        }

        return res.status(201).json(
            new ApiResponse(200,cretedUser,"User registered succesfully"))
})



export {registerUser}