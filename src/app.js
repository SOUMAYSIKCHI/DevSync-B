const express = require('express'); // Core web framework
require("dotenv").config();
const cookieParser = require("cookie-parser"); // To parse cookies from HTTP requests
const mongoSanitize = require('express-mongo-sanitize'); // Prevents NoSQL injection
const helmet = require("helmet"); // Adds security headers
const connectToDB = require("./config/database"); // MongoDB connection logic
const cors = require("cors");
const fileupload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const http = require("http");
const app = express();

const authRouter = require("./routes/authRoute"); // Handles /login, /register etc.
const profileRouter = require("./routes/profieRoute"); // User profile related endpoints
const reqRouter = require("./routes/requestsRoute"); // Handles user-generated requests
const userRoute = require('./routes/userRoutes'); // Admin/user management APIs
const cloudinary = require("./config/cloudinary");
const initializeSocket = require('./utils/socket'); // ✅ USE this, don’t redefine
const chatRoute = require("./routes/chatRoute");
const server = http.createServer(app);
initializeSocket(server); // ✅ connect sockets

cloudinary.cloudinaryConnect();

app.use(cors({
  origin:['http://3.109.253.167','http://localhost:5173'],
  credentials:true,
}));

app.use(mongoSanitize()); // Prevent MongoDB Operator Injection like {$gt: ""}
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies from headers
app.use(helmet()); // Apply secure HTTP headers (XSS, CSP, etc.)

const tempDir = path.join(__dirname, 'tmp');
// Ensure temp folder exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("✅ Created tmp folder at:", tempDir);
}

app.use(fileupload({
    useTempFiles : true,
    tempFileDir : tempDir
}));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", reqRouter);
app.use("/", userRoute);
app.use("/",chatRoute);


// Basic health check
app.get('/', (req, res) => {
    res.send("<h1>You are on wrong page.Please Reload</h1>"); 
});


// ---------------------------------------------
app.use((err, req, res, next) => {
  console.error('⚠️ Unexpected error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


connectToDB()
  .then(() => {
    console.log("✅ Database Connected");
    server.listen(3300, () => {
      console.log("🚀 Server is running at http://localhost:3300");
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
  });
