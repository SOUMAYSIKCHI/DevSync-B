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
//An index in MongoDB is like a pointer or lookup guide—it speeds up querying 
// by allowing MongoDB to locate data without scanning every document.
// compound Index 
connectionReqSchema.index(
    { 
        fromUserId: 1,
        toUserId: 1 
    },
    { 
        unique: true 
    }
);

// 🔍 What it does:
// Creates a compound index on { fromUserId, toUserId }.
// 1 means ascending order, but that's irrelevant for uniqueness.
// The unique: true constraint ensures that the same user can't send 
// multiple connection requests to the same person.
// 🧠 Why it's used:
// Prevents duplicate connection requests between the same users.
// Boosts query performance when searching for specific user-to-user connection records.

connectionReqSchema.pre("save",function(next){
    const connectionRequest = this;
    if (this.toUserId.equals(this.fromUserId)) {
        return next(new Error("You can't send a request to yourself"));
    }
    next();

 })
// This middleware is triggered before saving a new connection request to MongoDB.
// It prevents a user from sending a connection request to themselves.
// this refers to the document being saved.
// If the fromUserId and toUserId are the same, it throws an error.
// If not, it allows the save operation to proceed via next().
// 🧠 Why it's used:
// To enforce business logic before data is persisted. This improves data integrity and avoids redundant checks elsewhere in your app logic.

module.exports = mongoose.model("ConnectionReqModel",connectionReqSchema);