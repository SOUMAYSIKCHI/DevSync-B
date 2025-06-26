const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    emailId:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    flag:{
        type:Boolean
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    },
})

async function sendVerification(emailId,otp,flag=true){
    try{
        const mailResponse  = await mailSender(emailId,"Verify Your EmailId - DevSync",otp,flag);
        console.log(mailResponse);
    }catch(err){
        console.log("Error in Verification",err);
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerification(this.emailId,this.otp,this.flag);
    next();
})
module.exports = mongoose.model("OTP",OTPSchema);

