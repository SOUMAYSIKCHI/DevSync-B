const express = require('express');

const app = express();

app.use("/test",(req,res)=>{
    res.send("Hello from sever")
})
app.use("/",(req,res)=>{
    res.send("Hello from home")
})

app.listen(3300,()=>{
    console.log("Server is listening at port");
});