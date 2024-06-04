const mongoose = require("mongoose");

const bankDetailsSchema = mongoose.Schema({
  RiderName:{
    type:String,
    required:true,
    trim:true,
  },
  RiderPhone:{
    type:String,
    required:true,
    trim:true,
    unique:true
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    // match: /^[0-9]{10,18}$/,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  bankBranch: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    // match: /^[A-Z]{4}0[0-9]{6}$/,
    trim: true
  },
}, {
  timestamps: true
});

const BankDetails = mongoose.model("BankDetails", bankDetailsSchema);
module.exports = BankDetails;
