const express = require('express'); 
require("dotenv").config();
const cookieParser = require("cookie-parser"); 
const mongoSanitize = require('express-mongo-sanitize'); 
const helmet = require("helmet"); 
const connectToDB = require("./config/database"); 
const cors = require("cors");
const fileupload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const http = require("http");
const app = express();

const authRouter = require("./routes/authRoute"); 
const profileRouter = require("./routes/profieRoute"); 
const reqRouter = require("./routes/requestsRoute");
const userRoute = require('./routes/userRoutes'); 
const cloudinary = require("./config/cloudinary");
const initializeSocket = require('./utils/socket'); 
const chatRoute = require("./routes/chatRoute");
const server = http.createServer(app);
initializeSocket(server); 

cloudinary.cloudinaryConnect();

app.use(cors({
  origin:['http://3.109.253.167','http://localhost:5173'],
  credentials:true,
}));

app.use(mongoSanitize()); 
app.use(express.json()); 
app.use(cookieParser()); 
app.use(helmet());
const tempDir = path.join(__dirname, 'tmp');
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


app.get('/', (req, res) => {
    res.send("<h1>You are on wrong page.Please Reload</h1>"); 
});

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
