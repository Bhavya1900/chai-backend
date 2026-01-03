import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs" //nodejs file sysytem- helps in doing operations on file sysytem and its a file management system 

//permissions for uploading on cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary= async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploded 
        //console.log(response)
        console.log("File has been uploaded on cloudinary ",response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // it is  to remove the locally saved temporary file
        //  as the upload operation got fialed 
        return null
    }
}

export {uploadOnCloudinary}