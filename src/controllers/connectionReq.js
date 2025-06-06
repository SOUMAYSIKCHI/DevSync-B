const ConnectionReqModel = require("../models/connectionModel");
const User = require("../models/user");

//to send request req can be interested or ignored
const statusReq = async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const {status,toUserId} = req.params; 
        // if req is already accepted or rejected then throw error
        if(!(status=="interested" || status=="ignored")){
            throw new Error("Invalid status type")
        }
        if(fromUserId===toUserId){
            throw new Error("You can't send request to yourself");
        }
        const userExist = await User.findById({_id:toUserId});
        //if the req which we are sending to a user but he dont exist
        if(!userExist){
            throw new Error("User does not exist");
        }
        //if req from a to b exist or b to a exist 
        const ifExist = await ConnectionReqModel.findOne({
            // mutliple conditions  -> in or and if 1 is true it returns true
                $or:[
                    //diff coinditions ->
                    {fromUserId,toUserId},
                    {
                        fromUserId:toUserId,toUserId:fromUserId
                    }
                ]   
        })

        if(ifExist){
            throw new Error("Request already sent !!");
        }

        const connectionReq = new ConnectionReqModel({
            fromUserId,toUserId,status
        })

        const data = await connectionReq.save();
        res.status(200).json({
            message:`Connection ${status} successfully `,
            data
        })
    }catch(e){
        return res.status(400).json({
            success:"False",
            message:e.message
        })
    }
}

// to reject or accept any request
const reviewReq = async(req,res) => {
    try{
        const loggedInId = req.user._id;
        const requestId = req.params.requestId;
        const status = req.params.status;
        const allowedstatus = ["accepted","rejected"];
        
        if(!(status==="accepted" || status==="rejected")){
            throw new Error("Invalid Status Type!!!");
        }
        if(loggedInId===requestId) {
            throw new Error("You can't accept or reject your own Account");
        }
        const connectionRequest = await ConnectionReqModel.findOne({
            _id:requestId, 
            toUserId:loggedInId,
            status:"interested"
        })

        if(!connectionRequest) {
            throw new Error("Invalid Acitivity");
        }


        connectionRequest.status = status;

        const data = await connectionRequest.save();

        return res.status(200).json({
            message:`Succesfully : ${status}`,
            data:data,
        })

        
    }catch(e) {
        return res.status(401).json({
            success:false,
            message: e.message
        })
    }
}

module.exports = {statusReq,reviewReq}
