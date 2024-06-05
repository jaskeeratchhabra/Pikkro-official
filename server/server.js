const express=require("express");
const bodyParser =require("body-parser")
const cors = require("cors");
const usersRoute=require("./routes/userRoute")
const ordersRoute = require("./routes/orderRoute")
const partnersRoute= require("./routes/partnerRoute")
const paymentRoute = require("./routes/paymentRoute")
const BankRoute= require("./routes/BankdetailsRoute")
const path = require('path');
require('dotenv').config();

const app=express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});



app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false})); 

app.use("/api/users",usersRoute);
app.use("/api/orders",ordersRoute)
app.use("/api/partners",partnersRoute);
app.use("/api/payments/",paymentRoute)
app.use("/api/bank",BankRoute)
const db=require("./db")
const port = parseInt(process.env.PORT, 10) || 8080;


app.listen(port,()=>( console.log(`server is running on port ${port}`)))
