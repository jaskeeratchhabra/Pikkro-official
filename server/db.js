const mongoose= require("mongoose");

const mongoURL = process.env.MONGO_URI
mongoose.connect(mongoURL);

var connection =mongoose.connection

connection.on('error',()=> console.log("connection failed",mongoURL))

connection.on('connected',()=> console.log("db connected"))

module.exports=mongoose;   