const express=require("express");

const usersRoute=require("./routes/userRoute")
const ordersRoute = require("./routes/orderRoute")
const partnersRoute= require("./routes/partnerRoute")
// const userRoute = require("./routes/userRoute");
const app=express();

app.use(express.json());

app.use("/api/users",usersRoute);
app.use("/api/orders",ordersRoute)
app.use("/api/partners",partnersRoute);
const db=require("./db")
const port= process.env.PORT||5000;

app.listen(port,()=>( console.log(`server is running on port ${port}`)))
