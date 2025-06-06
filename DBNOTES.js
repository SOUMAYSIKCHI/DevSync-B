// 🗃️ What is MongoDB?
// MongoDB is a NoSQL document database that stores data in flexible, 
// JSON-like documents (BSON format), allowing you to handle semi-structured
//  or unstructured data efficiently.
// Think of MongoDB as a schema-less cloud-ready database designed for speed,
//  scalability, and flexibility.

// 🧩 What is Mongoose?
//Mongoose is an Object Data Modeling (ODM) library for MongoDB in Node.js. 
//It acts as a middleware layer that provides a structured, schema-based solution
//to model your data.
// Mongoose = MongoDB + Schema + Validation + Middleware + Abstraction

// 📘 What Do We Mean by "Schema" in Web Development & Databases?
// A schema is a blueprint or structure that defines how data is organized and validated in a database or application.
// 🧠 In Simple Terms:
// A schema is like a contract for your data — it defines what fields exist, their data types, and rules (e.g., required, unique, default values).

// ✅ In SQL (Relational DBs like MySQL, PostgreSQL):
// Yes — each schema typically corresponds to a table.

// For example:
// UserSchema → users table
// ProductSchema → products table

// //config -- database.js
const mongoose = require("mongoose");
require('dotenv').config();
const connectToDb = async()=>{
    await mongoose.connect(
        process.env.DATABASE_URL
    )
}
// app.js:
const connectToDB = require("./config/database");
connectToDB().then(()=>{
    console.log("Database Connected")
    app.listen(3300,()=>{
        console.log("Server is listening at port");
    });
}).catch(()=>{
    console.log("Database not created")
})

//models
//user schema ->
const mongoose = require("mongoose");
const validator = require("validator");
//The validator library is a lightweight, robust library
//  for string validation and sanitization, commonly used in Node.js applications, 
// especially with Mongoose for enforcing data integrity.
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema =  new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxLength:50,
        trim:true,
        required:true,
        index:true,
    },
    lastName:{
        type:String,
        maxLength:30,
        trim:true,
    },
    emailId:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Credentials");
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:12,
        max:80,
    },
    gender:{
        type:String,
        lowercase:true,
        validator(value){
            if(!["male","female","others"].includes(value)) {
                throw new Error("Invalid Input!!");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"",
        validator(value){
            if(!validator.isURL(value)){
                throw new Error("Photo Url is not valid")
            }
        }
    },
    about:{
        type:String,
        default:"Hello,Everyone",
        trim:true,
        maxLength:200,
    },
    skills:{
        type:[String],
        validate: {
            validator: function (value) {
                return value.length <= 8 && value.every(skill => skill.length < 16);
            },
            message: 'Skills array should not have more than 8 elements, and each skill should be less than 16 characters long.'
        }
    }
})

module.exports = mongoose.model("User",userSchema)

//✅ Explanation of module.exports = mongoose.model("User", userSchema)
//This line is exporting a Mongoose model so that it can be 
// imported and used in other parts of your Node.js + Express application





// !--------------------------------------------------------------------------
// 1. How MongoDB Injection Works
// MongoDB uses JSON-based queries, so if user input is not properly sanitized, an attacker can inject malicious JSON objects instead of SQL statements.


// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();

// mongoose.connect('mongodb://localhost:27017/mydb');

// const User = mongoose.model('User', new mongoose.Schema({
//     username: String,
//     password: String
// }));

// app.get('/login', async (req, res) => {
//     let { username, password } = req.query;

//     // ❌ UNSAFE: Directly inserting user input into the query
//     let user = await User.findOne({ username: username, password: password });

//     if (user) {
//         res.send("Login Successful");
//     } else {
//         res.send("Invalid Credentials");
//     }
// });

// Exploiting the Vulnerability
// An attacker could send a specially crafted request like:

// http://localhost:3000/login?username=admin&password[$ne]=
// This translates to:
// { "username": "admin", "password": { "$ne": "" } }

// $ne (not equal) makes the query return any user where the password is not empty.
// If an admin account exists, the attacker gains access without knowing the password.
// 2. How to Prevent MongoDB Injection?
// ✅ Use Mongoose’s Parameterized Queries
// Mongoose automatically sanitizes inputs when using findOne(), find(), etc., but using it correctly is crucial.

// let user = await User.findOne({ username, password }).lean();
// ✅ Use Input Validation
// Use libraries like Joi or express-validator to strictly validate user input.



// ✅ Use express-mongo-sanitize (Recommended)
// const mongoSanitize = require('express-mongo-sanitize');
// app.use(mongoSanitize());
// This package removes any MongoDB operators ($ne, $gt, etc.) from user input, preventing injections.

// What is Rate Limiting? 🚀
// Rate limiting is a security measure that restricts the number of requests a user or IP address can make to your server within a specific time period.

// 🔹 It helps prevent:
// ✅ DDoS attacks (Denial of Service)
// ✅ Brute-force attacks (guessing passwords)
// ✅ API abuse (too many requests per second)
// ✅ Bot spam (automated requests)

// 1️⃣ Example of Rate Limiting in Express.js
// You can use the express-rate-limit package to limit API requests.

// Install it first:
// npm install express-rate-limit
// Basic Rate Limiting Setup
// const rateLimit = require("express-rate-limit");

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // ⏳ 15 minutes
//     max: 100, // ⏳ Limit each IP to 100 requests per windowMs
//     message: "Too many requests from this IP, please try again later.",
//     headers: true, // Show rate limit headers in response
// });

// app.use(limiter);
// ✅ Now, each IP can only make 100 requests every 15 minutes.

//!----------------------------------- # Express.js Security Notes

//! ## 1️⃣ Prevent Common Attacks
// ✅ **DDoS Attacks** → Use **Rate Limiting**  
// ✅ **Brute-Force Attacks** → Use **Rate Limiting + bcrypt**  
// ✅ **MongoDB Injection** → Use **MongoSanitize**  
// ✅ **Cross-Site Scripting (XSS)** → Use **Helmet + Express Validator**  
// ✅ **CORS Security** → Restrict API Access  

// ---

//! ## 2️⃣ Install Security Packages
// Run the following command to install required security packages:
// ```bash
// npm install express-rate-limit helmet cors express-mongo-sanitize bcrypt jsonwebtoken dotenv
// ```

// ---

// !## 3️⃣ Apply Security in `app.js`
// ```javascript
// const express = require("express");
// const helmet = require("helmet");
// const cors = require("cors");
// const mongoSanitize = require("express-mongo-sanitize");
// const rateLimit = require("express-rate-limit");
// const dotenv = require("dotenv");

// dotenv.config();
// const app = express();

//! // 🛡️ Secure HTTP Headers
// app.use(helmet());

//! // 🔄 Enable CORS for specific domains
// app.use(cors({ origin: "https://yourfrontend.com", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));

//! // 🛡️ Prevent NoSQL Injection Attacks
// app.use(mongoSanitize());

//! !// 🚀 Apply Rate Limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: "Too many requests, try again later."
// });
// app.use(limiter);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// module.exports = app;
// ```

// ---

//! ## 4️⃣ Secure User Authentication (bcrypt + JWT)
// ### **Hash Passwords Before Storing**
// ```javascript
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const UserSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });

// UserSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// module.exports = mongoose.model("User", UserSchema);
// ```

// ---

//! ### **Login Route with Secure Password Check**
// ```javascript
// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//         res.json({ token, msg: "Login successful" });
//     } catch (err) {
//         res.status(500).json({ msg: "Server error" });
//     }
// };
// ```

// ---

//! ## 5️⃣ Protect Routes with JWT Authentication
// Create **middleware (`middlewares/auth.js`)** to protect routes:
// ```javascript
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const token = req.header("Authorization");
//     if (!token) return res.status(401).json({ msg: "Access denied, no token provided" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(400).json({ msg: "Invalid token" });
//     }
// };
// ```
// Now apply this middleware to **protected routes**:
// ```javascript
// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middlewares/auth");

// router.get("/dashboard", authMiddleware, (req, res) => {
//     res.json({ msg: "Welcome to the dashboard!" });
// });

// module.exports = router;
// ```

// ---

//! ## 6️⃣ Prevent Excessive Login Attempts (Rate Limiting)
// Apply **rate limiting** to login attempts in `routes/auth.js`:
// ```javascript
// const rateLimit = require("express-rate-limit");

// const loginLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000,
//     max: 5,
//     message: "Too many login attempts, try again later."
// });

// router.post("/login", loginLimiter, authController.login);
// ```

// ---

//! ## 7️⃣ Hide Sensitive Data in `.env`
// Create a **`.env`** file in the root directory:
// ```
// PORT=5000
// MONGO_URI=mongodb+srv://your_mongodb_url
// JWT_SECRET=your_secret_key
// ```
// Load environment variables in `server.js`:
// ```javascript
// require("dotenv").config();
// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("Database connected!"))
//     .catch(err => console.log(err));
// ```

// ---

// ## 🎯 Final Security Checklist
// ✅ **Helmet** → Secure HTTP headers  
// ✅ **CORS** → Restrict API access  
// ✅ **MongoSanitize** → Prevent NoSQL injection  
// ✅ **Rate Limiting** → Prevent brute-force & DDoS  
// ✅ **bcrypt** → Secure password storage  
// ✅ **JWT** → Secure authentication  
// ✅ **Environment Variables (`.env`)** → Hide sensitive data  

// ---

// ## 🔥 Next Steps
