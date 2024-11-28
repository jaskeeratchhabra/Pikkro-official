const express=require("express");
const bodyParser =require("body-parser")
const cors = require("cors");
const usersRoute=require("./routes/userRoute")
const ordersRoute = require("./routes/orderRoute")
const partnersRoute= require("./routes/partnerRoute")
const paymentRoute = require("./routes/paymentRoute")
const BankRoute= require("./routes/BankdetailsRoute")
const path = require('path');
const db=require("./db")
require('dotenv').config();

const app=express();


// const allowedOrigins = ['https://pikkro.com','http://localhost:5173'];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
//   credentials: true,
// };

// app.use(cors(corsOptions));

const corsOptions = {
  origin: '*', // Allow all origins
};

app.use(cors(corsOptions));
  

  
  
  app.use(express.json());
  app.use(bodyParser.urlencoded({extended:false})); 
  
  app.use("/api/users",usersRoute);
  app.use("/api/orders",ordersRoute)
  app.use("/api/partners",partnersRoute);
  app.use("/api/payments",paymentRoute)
  app.use("/api/bank",BankRoute)

  // app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname, '..', 'client','dist', 'index.html'));
  // });

const port = parseInt(process.env.PORT, 10) || 8080;


app.listen(port,()=>( console.log(`server is running on port ${port}`)))
