import { asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req, res) => {
   // get user details from frontend
   // validation
   // check if already exists: username, email
   // check for images, check for Avatar
   // upload to cloudinary
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check user creation
   // return res

    const  { fullName, email, username, password} = req.body 
    console.log("email: ", email); 

    console.log(req.body)

    // Fixed validation - check for empty string, not just space
    if (!fullName || fullName.trim() === ""){
        throw new ApiError(400, "Full name is required")
    }

    // Add validation for other required fields
    if (!email || email.trim() === ""){
        throw new ApiError(400, "Email is required")
    }
    
    if (!username || username.trim() === ""){
        throw new ApiError(400, "Username is required")
    }
    
    if (!password || password.trim() === ""){
        throw new ApiError(400, "Password is required")
    }

    // Fixed: Use User.findOne instead of username.findone
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existUser){
        throw new ApiError(409, "User with email or username already exist")
    }
    // console.log(req.files)


    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path
  
    // i don't understand this - another method 
    let coverImageLocalPath;
    if(req.files && Array.isArray ( req.files.coverImage) &&  req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].coverImageLocalPath
    }





    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    // Fixed: Use toLowerCase() instead of tolowercase()
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser){
        throw new ApiError(500, "Server went wrong while user register")
    }

    // Fixed: Remove duplicate .status and fix status code consistency
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export { registerUser}