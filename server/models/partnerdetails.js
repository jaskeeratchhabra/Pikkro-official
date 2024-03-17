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
    trim:true,
    required:true,
    unique:true
   },
   phone:{
    type:String,
    trim:true,
    required:true,
    unique:true
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
    required:true,
    unique:true
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
   },
   approved:{
    type:Boolean,
    default:false
   },
   disapproved:{
    type:Boolean,
    default:false
   }
},
{
    timestamps:true
}
)


const partnerdetails = mongoose.model("partnerdetails",partnerSchema);

module.exports = partnerdetails;