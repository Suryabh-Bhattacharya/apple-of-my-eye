const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./Models/user");
const app = express();
const cors = require("cors");
// const jwt = require('jsonwebtoken');

//Body Parser
app.use(express.json());
//using Cors
app.use(cors());

//Database Connection
const dbUrl = "mongodb://127.0.0.1:27017/loginpage"; 
mongoose.connect(dbUrl)
.then(()=>{
    console.log("MONGO CONNECTION OPEN!!!")
}).catch((err)=>{
    console.log("Database Connected!!");
    console.log(err);
})

//Routes
app.get("/",(req,res)=>{
    res.send("THIS IS THE BACKEND");
})

app.post("/api/register",async (req,res)=>{
    try{
        const user = await User.create({
            rollNo : req.body.rollNo,
            email:req.body.email,
            password: req.body.password,
        });
        await user.save();
        res.json({status:'ok'});
    }catch(err){
        console.log(err);
        res.json({status:'error',error:'Duplicate email'});
    }
})
app.post("/api/login",async (req,res)=>{
    try{
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password,
        });
        console.log(user);
        if(user){
        //     const token = jwt.sign(
        //         {
        //         rollNo : user.rollNo,
        //         email:user.email,
        //         },
        //         'secrethai'
        //     )
            res.json({status:'ok',user: true});
        }
        else{
            res.json({status:'error',user:false});
        }
    }catch(err){
        res.json({status:'error',error:'Duplicate email'});
    }
})

app.listen(5000,()=>{
    console.log("Server Running On Port 5000")
})