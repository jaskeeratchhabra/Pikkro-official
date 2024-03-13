const mongoose =require('mongoose');

const partnerSchema=mongoose.Schema(
{
   firstname:{
    type:String,
    required:true
   },
   lastname:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   phone:{
    type:Number,
    required:true
   },
   address:{
    type:String,
    required:true
   }
   ,
   vehicleType: {
    type:String,
    required:true
   },
   vehicleNumber:{
    type:String,
    required:true
   },
   dlDocument:{
    type:String,
    required:true
   },
   poaDocument:{
    type:String,
    required:true
   },
   poiDocument:{
    type:String,
    required:true
   },
   rcDocument:{
    type:String,
    required:true
   },
   bikePhoto:{
    type:String,
    required:true
   },
   profilePicture:{
    type:String,
    required:true
   }
},
{
    timestamps:true
}
)


const partnerdetails = mongoose.model("partnerdetails",partnerSchema);

module.exports = partnerdetails;