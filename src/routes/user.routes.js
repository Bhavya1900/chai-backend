import { Router } from "express";
import { logoutUser, registerUser,loginUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserchannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";
const router= Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("change-password").post(verifyJWT,changeCurrentPassword),
router.route("/current-user").get(verifyJWT,getCurrentUser) // user kuch bhej nhi raha isiliye get req
router.route("/update-account").patch(verifyJWT,updateAccountDetails) // sab update nhi only one thing so patch

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserchannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
export default router;
