const mongoose = require("mongoose");
require('dotenv').config();
const connectToDb = async()=>{
    await mongoose.connect(
        process.env.DATABASE_URL
    )
}
module.exports = connectToDb;

