const express = require("express");
const BankDetails = require("../models/BankDetails")
const router = express.Router();


router.get("/getbank", async(req,res)=>{
    try{
      const details  =await BankDetails.find({});
      res.send(details);
    }
    catch(error)
    {
      console.log(error.message)
      res.status(404).json({message:error.message})
    }
})

router.post("/bankdetails", async(req,res)=>{
    const details = new BankDetails(req.body);
    try{
       const newdetails = await details.save();
       res.status(200).json({details : newdetails})
    }
    catch(error)
    {
        console.log(error);
    }
})

router.patch('/edit', async (req, res) => {
    const { RiderPhone, accountHolderName, accountNumber, bankName, bankBranch, ifscCode } = req.body;
  
    try {
      // Find the bank details by RiderPhone
      let bankDetails = await BankDetails.findOne({ RiderPhone });
  
      // If bank details not found, return 404 Not Found status
      if (!bankDetails) {
        return res.status(404).json({ message: "Bank details not found" });
      }
  
      // Update bank details fields
      bankDetails.accountHolderName = accountHolderName;
      bankDetails.accountNumber = accountNumber;
      bankDetails.bankName = bankName;
      bankDetails.bankBranch = bankBranch;
      bankDetails.ifscCode = ifscCode;
  
      // Save the updated bank details
      await bankDetails.save();
  
      // Return success message
      res.status(200).json({ message: "Bank details updated successfully" });
    } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;