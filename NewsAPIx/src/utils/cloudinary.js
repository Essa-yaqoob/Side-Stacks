import {v2 as cloudinary} from "cloudinary"


cloudinary.config({
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
    cloud_name : process.env.CLOUDINARY_NAME,
})


export const uploadOnCloudinary = async (filePath) => {
    try {
        return await cloudinary.uploader.upload(filePath)
    } catch (error) {
        console.log(`Error uploading to cloudinary: ${error}`,)
        return null
    }
}