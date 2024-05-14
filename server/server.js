const express=require("express");
const bodyParser =require("body-parser")
const cors = require("cors");
const usersRoute=require("./routes/userRoute")
const ordersRoute = require("./routes/orderRoute")
const partnersRoute= require("./routes/partnerRoute")
require('dotenv').config();
const app=express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false})); 

app.use("/api/users",usersRoute);
app.use("/api/orders",ordersRoute)
app.use("/api/partners",partnersRoute);
const db=require("./db")
const port = parseInt(process.env.PORT, 10) || 8080;


app.listen(port,()=>( console.log(`server is running on port ${port}`)))
