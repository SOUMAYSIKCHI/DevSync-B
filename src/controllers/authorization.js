const jwt = require("jsonwebtoken");
require("dotenv").config();
const authorization = async(req,res,next)=>{
    try{
        const token = req.cookies["user"];
        if(!token){
            // console.log(token);
            throw new Error("User is not authenticated")
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();

    }catch(err){
        return res.status(401).json({
            success: false,
            message: err.message,
        });

    }
}

module.exports = {authorization};