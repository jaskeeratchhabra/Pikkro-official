const express=require("express");

const router=express.Router();

const Order = require("../models/order")

router.patch('/update/:id', async (req, res) => {
  const { id } = req.params;
  const orderData = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.patch('/updatepaymentfield', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.paymentSettled = true;
    order.paymentDue = false;

    await order.save();

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error("Error updating payment status", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.patch('/:_id', async (req, res) => {
  const { _id } = req.params;
  console.log(req.body);
  let canceledBy;
  const { value, RiderPhone, RiderName } = req.body;
  if(value==="canceled")
  {
    canceledBy= req.body.canceledBy;
  }
  try {
    const updateQuery = {};

    // Check the value of updatedField and construct the update query accordingly
    if (value === 'accepted') {
      updateQuery.accepted= true;
      updateQuery.RiderName= RiderName;
      updateQuery.RiderPhone= RiderPhone;
    } else if (value === 'picked') {
      updateQuery.picked = true;
    } else if(value==="completed"){
      updateQuery.completed= true;
    }
    else if(value === "canceled")
    {
      updateQuery.canceled = true
      updateQuery.canceledBy = canceledBy
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
  console.log("hello")
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