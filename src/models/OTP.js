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

// [User Request] ─▶ [OTP Created] ─▶ [Pre-save Hook] ─▶ [Send Email via Nodemailer]
//                                     │
//                                     └──> [Verification Email Sent] ─▶ [Save OTP in DB]
// User triggers an event that generates an OTP (e.g., during sign-up).
// A new document is created in the OTP model.
// Before the document is saved, the pre("save") hook sends the OTP email.
// If the email sends successfully, the OTP is persisted with a 5-minute expiration.
// If the email fails, the error is logged but the document is still saved (optional handling here).