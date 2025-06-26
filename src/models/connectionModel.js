const mongoose = require("mongoose");
const connectionReqSchema = new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        status:{
            type:String,
            required:true,
            enum:{
                values:["ignored","interested","accepted","rejected"],
                message:"{VALUE} is incorrect status type"
            }
        }
    },
    {
        timestamps:true,
    }

);

connectionReqSchema.index(
    { 
        fromUserId: 1,
        toUserId: 1 
    },
    { 
        unique: true 
    }
);



connectionReqSchema.pre("save",function(next){
    const connectionRequest = this;
    if (this.toUserId.equals(this.fromUserId)) {
        return next(new Error("You can't send a request to yourself"));
    }
    next();

 })


module.exports = mongoose.model("ConnectionReqModel",connectionReqSchema);