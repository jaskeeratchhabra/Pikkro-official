const express=require("express");
const router=express.Router();

const User = require("../models/users");

router.post("/register",async(req,res)=>{
    
    console.log(req.body);
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