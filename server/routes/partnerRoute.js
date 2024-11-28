const express=require("express");
const router=express.Router();
const Partner=require("../models/partnerdetails")

const upload = require("../middleware/multer.middleware")
const uploadOnCloudinary =  require("../utils/cloudinary")
const fs = require("fs")


router.patch('/:_id', async (req, res) => {
  const { _id } = req.params;
  const { updatedField } = req.body;

  try {
    const updateQuery = {};

    // Check the value of updatedField and construct the update query accordingly
    if (updatedField === 'approved') {
      updateQuery.approved = true;
      updateQuery.disapproved=false;
    } else if (updatedField === 'disapproved') {
      updateQuery.disapproved = true;
      updateQuery.approved=false
    } 
    else if(updatedField==="registered")
    {
        updateQuery.registered=true;
    }
    else {
      return res.status(400).json({ message: 'Invalid updatedField value' });
    }

    const document = await Partner.findByIdAndUpdate(
      _id, // Find the document by its _id
      { $set: updateQuery }, // Update the document based on the constructed updateQuery
      { new: true } // Return the updated document
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Field updated successfully', updatedDocument: document });
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/newpartner', upload.fields([
    { name: 'dlDocument', maxCount: 1 },
    { name: 'poaDocument', maxCount: 1 },
    { name: 'poiDocument', maxCount: 1 },
    { name: 'rcDocument', maxCount: 1 },
    { name: 'bikePhoto', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
  ]), async (req, res) => {
    // console.log(req.files);
    try {
      const {
        firstname,
        lastname,
        email,
        phone,
        address,
        vehicleType,
        vehicleNumber
      } = req.body;

      const uploadPromises = Object.keys(req.files).map(async (fieldName) => {
        const file = req.files[fieldName][0];
        const result = await uploadOnCloudinary(file.path)
        return { [fieldName]: result.url };
      });
  
      const fileUrls = await Promise.all(uploadPromises);
      // console.log(fileUrls)
    
      const formDataWithFileUrls = {
        firstname,
        lastname,
        email,
        phone,
        address,
        vehicleType,
        vehicleNumber,
        ...Object.assign({}, ...fileUrls)
      };
  
      // fs.unlinkSync(file.path)

      const newpartner = new Partner({...formDataWithFileUrls});
      console.log(newpartner);
      const result = await newpartner.save()
      
      res.status(200).json({ message: 'Form data and files uploaded successfully', formDataWithFileUrls });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'An error occurred while uploading files to Cloudinary' });
    }
  });


  router.get("/getpartners", async(req,res)=>{
    try{
        const partners = await Partner.find({});
        return res.send(partners);
    }
    catch(error){
        console.log(error.message);
        return res.status(400).json({error : error.message});
    }
  })

module.exports=router