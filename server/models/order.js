const mongoose=require("mongoose");

const orderSchema=mongoose.Schema({
    
    userPhone:{
        type:Number,
        required:true
    },
     Item:{
        type:String,
        required:true
      },
      weight:{
          type:String,
          required:true
      },
      parcelValue:{
        type:Number,
        require:true
      },
      price:{
        type:Number,
        required:true
      },
      paymentType:{
        type:String,
        required:true
      },
      PickupDetails:{
        address:
        {
            type:String,
            required:true
        },
        Phone:{
            type:Number,
            required:true
        },
        Locality:{
            type:String,
            required:true
        }
      }
      ,
      DeliveryDetails:{
        address:
        {
            type:String,
            required:true
        },
        Phone:{
            type:Number,
            required:true
        },
        Locality:{
            type:String,
            required:true
        }
     },
     instruction:{
        type:String,
     },
     Date:{
        type:String,
        required:true
     }
    },
    {
        timestamps:true
    }
)

const orderModel=mongoose.model("orders",orderSchema);
module.exports = orderModel