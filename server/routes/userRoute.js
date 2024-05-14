const express=require("express");
const router=express.Router();
const fast2sms = require("fast-two-sms");
const User = require("../models/users");
const otpGenerator = require('otp-generator');
require('dotenv').config();

router.post("/generateOTP", async(req,res)=>{
    var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });

    var {number} = req.body;
    console.log(req.body);
    const options  ={
        authorization : process.env.OTP_Authorization,
        message: `Hi user, this otp is sent by pikkro.com for your phone number verification your otp is ${otp} valid for 10 mins.`,
        numbers: [`${number}`]
    
    }
    console.log(options)
    fast2sms.sendMessage(options)
    .then((response)=>{
        console.log(response)
        if(response.return)
        {
            console.log("otp sent successfully")
            res.send(otp);
        }
        else
        {
            console.log("something went wrong");
        }
    })
    .catch((error)=>
        {
            console.log(error.message);
        }
    )
    })

router.post("/register",async(req,res)=>{
    
    // console.log(req.body);
    const newuser=new User({
        name:req.body.name,
        phone:req.body.phone,
        email:req.body.email,
        password:req.body.password,
        isAdmin :req.body.isAdmin,
        isRider:req.body.isRider
       });
      try{
        const prevUser=await User.findOne({phone:req.body.phone});
        if(prevUser){
         console.log("already registered")
            res.send(prevUser);
        }
        else{
          const user =await newuser.save()
          res.send(newuser);
        }
     }
     catch(error){
          console.log(error.message);
         return res.status(400).json([error]);
     }
 })

 router.post("/login",async(req,res)=>{
    const {phone , password}=req.body;
    try{
        // console.log(req.body);
        const user=await User.findOne({phone,password});
        if(user){
            console.log("user found")
            res.send(user);
        }
        else{
        console.log("user not found")
        return res.status(400).json({message:"User Not Found"});4
       }
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json([error]);
    }
    
})

 module.exports=router