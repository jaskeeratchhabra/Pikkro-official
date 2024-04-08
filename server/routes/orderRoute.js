const express=require("express");

const router=express.Router();

const Order = require("../models/order")

router.patch('/:_id', async (req, res) => {
  const { _id } = req.params;
  const { statusValue } = req.body;
  console.log(req.body);
  try {
    const updateQuery = {};

    // Check the value of updatedField and construct the update query accordingly
    if (statusValue === 'accepted') {
      updateQuery.accepted= true;
    } else if (statusValue === 'picked') {
      updateQuery.picked = true;
    } else if(statusValue==="completed"){
      updateQuery.completed= true;
    }
    else {
      return res.status(400).json({ message: 'Invalid updatedField value' });
    }

    const document = await Order.findByIdAndUpdate(
      _id, 
      { $set: updateQuery }, 
      { new: true }
    );
    console.log(document);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Field updated successfully', updatedDocument: document });
  } catch (error) {
    console.error('Error updating field:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/getorder", async(req,res)=>{
  try{
      const orders = await Order.find({});
      res.send(orders);
  }
  catch(error){
    console.log(error.message);
  }
})

router.post("/neworder",async(req,res)=>{
    
      const orderData = new Order(req.body);
      try{
          const neworder = await orderData.save();
          console.log(neworder);
          res.send("order placed successfully");
      }
      catch(error){
        console.log(error.message);
      }
}
)

router.post("/myorder", async (req, res) => {
    const { userPhone } = req.body; 
    console.log(req.body);

  try {
      const orders = await Order.find({userPhone});
      if (orders) {
          res.send(orders);
        //   console.log(orders)
      } else {
          res.status(404).send("No orders found for the given phone number");
      }
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});


module.exports = router  ;