
require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const paymentRequest = require("../models/payment")
const router = express.Router();


router.patch("/:reqId", async(req,res)=>{
    const {reqId} = req.params;
    try{
       const  request =  await paymentRequest.findById(reqId);
       if(request){
           request.paymentCompleted=true;
           await request.save();
           res.status(200).json("request fullfilled, field updated");
       }
       else{
        res.status(404).json("req not fullfilled, something went wrong");
       }
    }
    catch(error)
    {
        console.log(error.message);
        res.send(error.message);
    }
})

router.get("/getrequest", async (req,res)=>{
    try {
        const incompleteRequests = await paymentRequest.find({ paymentCompleted: false });
        res.status(200).json(incompleteRequests);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
router.post("/settlement", async (req,res)=>{
     const {riderName, riderPhone, amount} = req.body;
     console.log(req.body);
     try
     {
       const newRequest = new paymentRequest({
          riderName, riderPhone, amount
       })
       const request= await newRequest.save();
       console.log(request)
       if(request){
        res.status(200).send("request sent succesfully");
       }
    }
    catch(error)
    {
        console.log(error.message);
        res.status(404).send("bad request");
    }
})


router.post("/orders", async (req, res) => {
    function generateReceipt() {
        const timestamp = Date.now(); // Get the current timestamp
        const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
        return `receipt_order_${timestamp}_${randomString}`;
    }
    console.log(req.body);
    var {price}= req.body;
    price = price *100;
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: price, 
            currency: "INR",
            receipt: generateReceipt(),
        };

        const order = await instance.orders.create(options);
        console.log(order)
        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
        
    }
});

router.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports= router;
