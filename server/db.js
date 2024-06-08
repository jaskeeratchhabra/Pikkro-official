const mongoose= require("mongoose");

const mongoURL = process.env.MONGO_URI

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch(error => console.error("Error connecting to MongoDB:", error));

var connection =mongoose.connection

connection.on('error',()=> console.log("connection failed",mongoURL))

connection.on('connected',()=> console.log("db connected"))

module.exports=mongoose;   