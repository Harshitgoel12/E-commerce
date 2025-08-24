import mongoose from "mongoose";

const OTPSchema= new mongoose.Schema({
    OTP:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
    }
},{timestamps:true});

const OTPModel= mongoose.model("OTP",OTPSchema);
export default OTPModel;

