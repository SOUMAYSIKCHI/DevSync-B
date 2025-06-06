npm init
npm i express
created src
    -created app.js
<!-- 
/npx - It allows you to run commands from Node modules that are installed either globally or locally, without needing to install them globally first -->

 <!-- Install nodemon locally in your project -->
npm i nodemon
    npx nodemon src/app.js
<!--  Install nodemon globally -->
npm install -g nodemon
    nodemon src/app.js

<!-- In package.json -> -->
 "scripts": {
    "start":"node src/app.js",
    "dev":"npx nodemon src/app.js"
},

<!-- Inititalize  -->
git init
git add .
git commit -m "msg"
git remote add origin https://github.com/SOUMAYSIKCHI/DevTinder.git
git branch -M main
git push -u origin main

<!-- mongoose -->
npm i mongoose

<!-- validator -->
npm i validator

<!-- Encrypt -->
npm i bcrypt

<!-- cookie parser -->
npm i cookie-parser

<!-- jwt token -->
npm i jsonwebtoken
npm i express-mongo-sanitize
<!-- rate limitor -->
npm install express-rate-limit
npm i  helmet 
npm i cors
npm i dotenv
npm install crypto-js
<!-- File upload -->
npm install  cloudinary 
npm i express-fileupload



// FOLDER DESCRIPTION
//CONFIG FOLDER -> IT HAS DATABASE.JS FILE WHICH HAS CODE OF HOW TO CONNECT TO DATABASE
//MODELS FOLDER -> IT CONSIST OF MULTIPLE DIFF SCHEMAS ..SCHEMA MEANS LIKE TABLE DB TABLE
//Routes FOLDER -> IT CONSIST DIFF ROUTERS WHICH HANDLE ROUTES 
//CONTROLLERS -> HANDLERS LOGIC OF DIFF ROUTES WHICH COMES 
//UTILS -> HELP UTILITY FUNCTIONS

DIFF ROUTES ARE : 
<!-- 
app.use("/api/v1/profile",profileRouter);
app.use("/api/v1/request",reqRouter);
app.use("/api/v1/user",userRoute);
app.use("/api/v1",authRouter); -->

//View Profile and Update Profile ->
app.use("/api/v1/profile",profileRouter);
/api/v1/profile/profileUpdate
/api/v1/profile/profileView
profileRouter.get("/profileView",authorization,profileView);
profileRouter.patch("/profileUpdate",authorization,profileUpdate);

//Request Router -> SEND REQUEST OR REVIEW REQUEST
reqRouter.post("/send/:status/:toUserId",authorization,statusReq);
reqRouter.post("/review/:status/:requestId",authorization,reviewReq);

//AUTH ROUTER -> FOR FIRST TIME LOGIN OR SIGNUP OR LOGOUT
authRouter.post("/login",loginLimiter,login);
authRouter.post("/signup",signupLimiter,signup);
authRouter.post("/logout",logout);

//USERROUTER-> GET REQ RECEIVER OR GET CONNECTIONS OR GET FEED

userRoute.get("/request/received",authorization,requestReceived);
userRoute.get("/connections",authorization,connections)
userRoute.get("/feed",feed);





<!-- DevTinder API's :-->
-POST/signup
-POST/login
-POST/logout


-GET/profile/view
-PATCH/profile/edit
-PATCH/profile/password

-POST/request/send/interested/:userId
-POST/request/send/ignored/:userId

-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId

-GET/connections
-GET/feed