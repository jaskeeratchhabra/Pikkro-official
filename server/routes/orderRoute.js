const express=require("express");

const router=express.Router();

const Order = require("../models/order")

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

  try {
      const orders = await Order.find(userPhone);
      if (orders) {
          res.send(orders);
          console.log(orders)
      } else {
          res.status(404).send("No orders found for the given phone number");
      }
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});


module.exports = router  ;