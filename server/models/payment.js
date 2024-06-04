const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
       riderName :{
        type:String,
        required:true,
        trim:true
       },
       riderPhone:{
        type:String,
        required:true,
        trim:true
       },
       amount:{
         type:Number,
         required:true
       },
       createdAt: {
        type: Date,
        default: Date.now
       },
       updatedAt: {
        type: Date,
        default: Date.now
       },
       paymentCompleted:{
        type:Boolean,
        default:false
       },
    },
    {
       timestamps:true
    }
)

paymentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
const paymentModel = mongoose.model("payment", paymentSchema);
module.exports = paymentModel;