const express=require("express");
const router=express.Router();
const fast2sms = require("fast-two-sms");
const User = require("../models/users");
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
// const path = require('path');
// const buildPath = path.join(__dirname, '..', 'build');
// app.use(express.static(buildPath)); 


require('dotenv').config();


router.get("/getonlinepartners", async(req,res)=>{
    try{
        const riders = await User.find({onDuty:true});
        console.log(riders,"hello");
        res.send(riders);
    }
    catch(error)
    {
      console.log(error.message);
      res.status(404).json({error:error.message});
    }
})

router.post('/email',(req,res)=>{
    // const { to, subject, description,from } = req.body;
    console.log(req.body);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });;

    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.to, 
        subject: req.body.subject, 
        text:req.body.description,
        html: `
        <div style="padding:10px;border-style: ridge">
        <p> You have update from Pikkro.com </p>
        <ul>
            <li>Email: ${req.body.to}</li>
            <li>Subject: ${req.body.subject}</li>
            <li>Message: ${req.body.description}</li>
        </ul>
        `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error)
        {
          console.log(error.message ,"email has not been sent");
          res.json({status: false, respMesg: 'Email has not been sent'})
        } 
        else 
        {
          console.log("email sent successfully")
          res.json({status: true, respMesg: 'Email Sent Successfully'})
        }
    
      });
});

router.patch("/:phone",async(req,res)=>{

    const phone = req.params;
    if(req.body.password){
        var password = req.body.password;
    }
    // console.log(req.body, phone); 
    if(req.body.onDuty)
    {
         var onDuty= req.body.onDuty;
    }
    try {
        const user=await User.findOne({phone:phone});
        console.log(user ,phone)
        if(req.body.onDuty && onDuty===true)
        {
            user.onDuty=true;
            await user.save();
            console.log("state updated")
            return res.status(200).json({ message: "state updated successfully" })
        }
        else
        if(req.body.onDuty){
            user.onDuty=false;
            await user.save();
            console.log("state set to false")
            return res.status(200).json({ message: "state updated successfully" })
        }
        else
        if(user && password){
            user.password = password;
            await user.save();
            console.log(user)
            return res.status(200).json({ message: "Password updated successfully" })
        }
        else{
        if(password){
           console.log("user not found")
           return res.status(400).json({message:"User Not Found"});
        }
       }     
      } catch (error) {
        console.error('Error updating field:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}
)


router.post("/generateOTP", async(req,res)=>{
    var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });

    var {number} = req.body;
    // console.log(req.body);
    const messageContent = `Hi user, this otp is sent by pikkro.com for your phone number verification. Your otp is ${otp} valid for 10 mins.`;
        const options = {
            authorization: process.env.OTP_Authorization,
            message: messageContent,
            numbers: [number]
        };
    // console.log(options)
    fast2sms.sendMessage(options)
    .then((response)=>{
        console.log(response)
        if(response.return)
        {
            console.log("otp sent successfully")
            console.log(otp)
            res.send(otp);
        }
        else
        {
            console.log("something went wrong");
        }
    })
    .catch((error)=>
        {
            console.log(error);
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
          console.log(error.message, "hello");
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