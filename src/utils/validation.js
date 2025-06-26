const validator = require("validator");

const ValidSignupData = (req)=>{
    const {firstName,password} = req.body;
    if(firstName==="") {
        throw new Error("Name is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong Password");
    }
}

module.exports ={
    ValidSignupData,
};