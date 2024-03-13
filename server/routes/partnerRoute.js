const express=require("express");

const router=express.Router();

const partnerDetails = require("../models/partnerdetails");

router.post("/newpartner",async(req,res)=>{

    const newpartner=  new partnerDetails(req.body);
    try{
       const result =await newpartner.save();
       if(result){
        res.send("New partner registered successfully");
       }
    }
    catch(error){
        console.log(error.message);
    }
})

module.exports=router