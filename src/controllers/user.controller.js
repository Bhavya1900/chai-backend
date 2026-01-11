import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave: false});
         return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(400,"Something went wrong while generating Refresh and Access tokens")
    }
}
const registerUser=asyncHandler(async(req,res)=>{
     // get user details from frontend(jab tak no full project data postman se lege)
     // validation all feilds are given by users(not empty)
     // check if user alrady exists -(best practice : check with username or email)
     // check for images, check for avatar
     //if there then upload it to cloudinary
     //user->multer->cloudinary->(we got an url)
     //create user object (nosql database)-create entry in db(db calls)
     // remove password and refresh token feild from Apiresponse()
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
            throw new ApiError(400,"All fields required")
        }

        const existedUser= await User.findOne({
            $or:[{username},{email}]
        })

        if(existedUser){
            throw new ApiError(409,"User with email and userName already exist")
        }
        //console.log(req.files);
        
        const avatarLocalPath=req.files?.avatar[0]?.path;
         //const coverImageLocalPath=req.files?.coverImage[0]?.path;

         let coverImageLocalPath;
         if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
            coverImageLocalPath=req.files.coverImage[0].path;
         }

        if(!avatarLocalPath){
            throw new ApiError(400,"Avtar file is required")
        }

        const avatar=await uploadOnCloudinary(avatarLocalPath);
        const coverImage=await uploadOnCloudinary(coverImageLocalPath);

        if(!avatar){
            throw new ApiError(400,"Avatar file is required");
        }

        const user=await User.create({
            fullName,
            avatar: avatar.url,
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

const loginUser= asyncHandler(async(req,res)=>{
    // req.body se data le aao
    // then check email/username se ki user exist or not 
    // if yes then us particular user ke liye check password
    // then if error send Api error format
    //if yes generate tokens and send to browser as cookies 
    //send api response login successful 



    const {email,username,password}=req.body
    // console.log(email)
    // console.log(username)
    if(!username && !email){
        throw new ApiError(400,"Username or email is required")
    }


    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(!existedUser){
        throw new ApiError(400,"user does not exist")
    }

    const isPasswordValid=await existedUser.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400,"Password Incorrect");
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(existedUser._id)
    
    
    const loggedInUSer=await User.findById(existedUser._id).select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(
        200,
        //data
        {
            user: loggedInUSer,accessToken,refreshToken
        },
        "User loggedIn successfully"
    ))


})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User loggedOut successfully"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookies?.refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"Unauthorized Request")
        }
        
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invalid refersh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options={
            httpOnly: true,
            secure: true
        }
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
        return res.status(200)
        .cookie("accessToken",accessToken)
        .cookie("refreshToken",newRefreshToken)
        .json(
            new ApiResponse(200,{
                accessToken,refreshToken:newRefreshToken
            },"Access Token refreshed Succesfuly")
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid Refresh Token")
    }
})


export {registerUser,loginUser,logoutUser,refreshAccessToken}