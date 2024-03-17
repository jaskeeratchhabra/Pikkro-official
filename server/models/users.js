const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    phone:{
       type:String,
       unique:true,
       required:true,
       trim:true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isRider:{
        type:Boolean,
        default:false
    }
},
    {
      timestamps:true,
    }
)


const userModel=mongoose.model('users',userSchema)

module.exports =userModel;