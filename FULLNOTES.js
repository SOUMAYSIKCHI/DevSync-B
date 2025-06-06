// Starting my project : Dev Tinder
// npm init
// npm i express
// created src
//     -created app.js
// <!-- 
// /npx - It allows you to run commands from Node modules that are installed either globally or locally, without needing to install them globally first -->

//  <!-- Install nodemon locally in your project -->
// npm i nodemon ->
//     npx nodemon src/app.js
// <!--  Install nodemon globally -->
// npm install -g nodemon
//     nodemon src/app.js

// <!-- In package.json -> -->
//  "scripts": {
//     "start":"node src/app.js",
//     "dev":"npx nodemon src/app.js"
// },

// <!-- Inititalize  -->
// git init
// git add .
// git commit -m "msg"
// git remote add origin https://github.com/SOUMAYSIKCHI/DevTinder.git
// git branch -M main
// git push -u origin main

// <!-- mongoose -->
// npm i mongoose

// <!-- validator -->
// npm i validator

// <!-- Encrypt -->
// npm i bcrypt

// <!-- cookie parser -->
// npm i cookie-parser

// <!-- jwt token -->
// npm i jsonwebtoken
// npm i express-mongo-sanitize
// <!-- rate limitor -->
// npm install express-rate-limit
// npm i  helmet 
// npm i cors
// npm i dotenv
// npm install crypto-js

// !-------------------------------------------------------------------------------
// <Episode - 1 Creating our own express Server>
const express = require("express");
const app = express();
app.listen(3000,()=>{
    console.log("Server os lisetning at 30000 port"); 
})
// in -> this if u try to access / u will get cannot get /
app.use("/test",(req,res)=>{
    res.send("<h1> Hello my server is started</h1>");
})

// !-------------------------------------------------------------------------------
//Episode - 2 Routing and Request handling
//Routing in Express.js refers to defining how your application responds to client requests (HTTP methods like GET, POST, etc.) at specific endpoints (URLs).

// ---------------------Example 1 : if u go to hello also we will get / page bcoz that is matched
app.use("/",(req,res)=>{
    res.send("<h1>/ page </h1>")
})

app.use("/hello",(req,res)=>{
    res.send("<h1> Hello page </h1>")
})

// ---------------------------------------------------------------------------------------------
app.use("/",(req,res)=>{
    res.send("<>Hi hello</>")
})

app.use("/hello",(req,res)=>{
    res.send("Hello hello hello")
})


// in below code if we go to /hello it still go to "/" as "/hello" ka "/" got matched
// ie if anything matches to "/" then it will go to "/"


// but if this is done : then it will work perfect so order works and matters
app.use("/hello",(req,res)=>{
    res.send("Hello hello hello")
})
app.use("/",(req,res)=>{
    res.send("<>Hi hello</>")
})

// ------------------------------------
//Code start running from top and the order is very very important
//Example 2: 
app.use("/hello",(req,res)=>{
    res.send("<h1> Hello page </h1>")
})

app.use("/hello/xyz",(req,res)=>{
    res.send("<h1>Abra ka dabra </h1>")
})
app.use("/",(req,res)=>{
    res.send("<h1>/ page </h1>")
})

// -----------------------------------
// Example 3:
app.use("/hello/xyz",(req,res)=>{
    res.send("<h1>Abra ka dabra </h1>")
})

app.use("/hello",(req,res)=>{
    res.send("<h1> Hello page </h1>")
})

app.use("/",(req,res)=>{
    res.send("<h1>/ page </h1>")
})

// HTTP METHODS :
// GET – Retrieve data
// ➤ Fetch user profile info from /users/123.

// POST – Create new data
// ➤ Submit a new blog post to /posts.

// PUT – Update/replace entire data
// ➤ Replace a user's full info at /users/123.

// PATCH – Update partial data
// ➤ Update just the user's email at /users/123.

// DELETE – Remove data
// ➤ Delete a user account via /users/123.

// HEAD – Get headers only
// ➤ Check if a file exists at /files/report.pdf.

// OPTIONS – Get supported methods
// ➤ Ask what methods /users supports for CORS.

// app.get() – Fetch data from the server
// ➤ Get a user's profile from /users/:id.

// app.post() – Create a new resource
// ➤ Add a new user to /users.

// app.use() – Apply middleware globally or on specific routes
// ➤ Use express.json() to parse JSON requests globally.

// app.put() – Fully update an existing resource
// ➤ Replace a user's data at /users/:id.

// app.patch() – Partially update a resource
// ➤ Update only the email at /users/:id.

// app.delete() – Delete a resource
// ➤ Remove a user via /users/:id.

// app.use() — Middleware handler
// Purpose: Mounts middleware functions globally or to specific route prefixes.
// Executes: For all HTTP methods (GET, POST, PUT, etc.) unless filtered inside the middleware.
// Use case: Logging, authentication, parsing JSON, error handling.


// we can also use regular expressions in route to match it like :
app.use('/app/.*fly$/',(req,res)=>{
    res.send("hahaha");
});
// whenever u write a url in browser it send get api call to sever

// app.use() => this will match all https methods

app.use("/ab?c",()=>{
    //means /ac will also work 
    //regular expression can also be used
})



// Query Parameters:
app.use("/user?userId=101&password=soumay",(req,res)=>{
    console.log(req.query);
})
// :-> dynamic route
app.use("/user/:userId/:name",(req,res)=>{
    console.log(req.params);
})

// !-------------------------------------------------------------------------------
//Episode - 3 Middleware and Error Handlers
app.use("/user",(req,res)=>{
    res.send("<h1>Hello 1st res</h1>");  //->IF THIS LINE IS REMOVED THEN IT WILL HANG AND WONT GO TO SECOND HANDLER
},(req,res)=>{
    res.send("<h1>Hi 2nd res</h1>");
})

// EXAMPLE 2 => SO we can use next() handler
app.use("/user",(req,res,next)=>{
    next();
},(req,res)=>{
    res.send("<h1>Hi 2nd res</h1>");
})

//Example 3 ->
app.use("/user",(req,res,next)=>{
    res.send("<h1>Hello 1st res</h1>")
    next();
},(req,res)=>{
    res.send("<h1>Hi 2nd res</h1>");  //here we  will get error bcoz response is already sent
})

//Example 4 ->
app.use("/user",(req,res,next)=>{
    next();
    res.send("<h1>Hello 1st res</h1>");
},(req,res)=>{
    res.send("<h1>Hi 2nd res</h1>");  
})

//A middleware in Express.js is a function that gets executed 
// during the request-response lifecycle. It can modify 
// the request (req) or response (res) objects, execute code,
//  or terminate or pass control to the next middleware using next().

// !-------------------------------------------------------------------------------

app.use("/admin",(req,res,next)=>{
    const pass = "xyz";
    if(pass==="xyz"){
        next();
    }else{
        res.send("<h1>PASS WRONG</h1>")
    }
});
app.use("/admin/info",(req,res)=>{
    res.send("<h1>Hello </h1>")
})

app.get("/",(err,req,res,next)=>{
    if(err){

    }else{

    }
})
// !-------------------------------------------------------------------------------
//Episode-04 | Database, Schema & Models | Mongoose

// CONFIG FOLDER WILL HAVE FILE OF DATABASE CONNECTION
//config -- database.js
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


// ! FIRST CONNECT TO DATABASE THEN SHOULD DO APP.JS
//! REFER TO DBNOTES FOR ALL DATABASE RELATED NOTES


