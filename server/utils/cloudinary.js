const cloudinary = require('cloudinary');
const dotenv =require("dotenv") 
require('dotenv').config();

// const a = process.env.CLOUDINARY_API_KEY
// console.log(a==="854971252852455")

const fs = require("fs");      
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET_KEY
});

const uploadOnCloudinary=async(localFilePath)=>{
    try{
       if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
       })
      if(response)
      {
        // fs.unlinkSync(localFilePath)
         console.log("upload successfully");
      }
       return response;
    }
    catch(error){
      // console.log("hello")
      console.log(error.message)
       fs.unlinkSync(localFilePath)//remove the local saved temp file on the server
    }
}

module.exports = uploadOnCloudinary;




// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });
