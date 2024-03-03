const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./Models/user");
const Studentdata = require("./Models/studentdata");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "yesecrethaibhai";
const bcrypt = require("bcrypt");
const { Vonage } = require('@vonage/server-sdk');
const { stringify } = require("querystring");
const fetchUser = require("./middleware/fetchUser");

const vonage = new Vonage({
  apiKey: "e02bfe4e",
  apiSecret: "7TWoazx4DVhpon66"
});
const from = "Vonage APIs"
let to = ""
let text = '';

const sendSMS = async () => {
    try {
        await vonage.sms.send({ to, from, text });
        return true; // SMS sent successfully
    } catch (error) {
        console.error('There was an error sending the messages.', error);
        return false; // Error sending SMS
    }
}

let OTP;
let newuser;
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
//registering an user if he enters correct otp
app.post("/api/register",async (req,res)=>{
    try{
        console.log(req.body);
        if(req.body.otp != OTP){
            return res.status(400).json({msg :"Incorrect OTP"})
        }
        const temp = new User({
            otp: req.body.otp,
            rollNo : req.body.rollNo,
            phoneNumber:req.body.phoneNumber,
            password: req.body.password,
        });
        console.log(temp);
        await temp.save();
        OTP ="";
        const data={
            user:{
                id:temp._id,
            }
        }
        // const authtoken = jwt.sign(data,JWT_SECRET);
        const authtoken="";
        // console.log(authtoken);
        return res.json({status:'ok',authtoken:authtoken,user: temp});
    }catch(err){
        console.log(err);
        res.json({status:'error',error:'Duplicate email'});
    }
})
//route to get an otp
app.post("/api/getOtp",async (req,res)=>{
    newuser = null;
    to = "";
    text = "";
    console.log(req.body);
    try{
        const {phoneNumber,rollNo} = req.body;
        let existinguser = await User.findOne({phoneNumber});
        if(existinguser){
            console.log("USER EXISTS");
            return res
                .status(400)
                .json({status : 'error', msg: "number already registered"})
        }
        existinguser = await User.findOne({rollNo});
        if(existinguser){
            console.log("rollNo EXISTS");
            return res
                .status(400)
                .json({status : 'error', msg: "roll no exists!!"})
        }
        newuser = new User({
            rollNo : req.body.rollNo,
            phoneNumber:req.body.phoneNumber,
            password: req.body.password,
        })
        OTP = "1234";
        //avoiding message (temporary for testing purpose the below code is commented)---------------------------
        // let digits = "0123456789";
        // OTP ="";
        // for( let i = 0 ; i<4;i++){
        //     OTP += digits[Math.floor(Math.random()*10)];
        // }
        // let num = req.body.phoneNumber;
        // num = num.toString();
        // to = "+91" + num;
        // console.log(to);
        // text = `Your OTP verification for user ${req.body.rollNo} is ${OTP}`;

        return res.status(200).json({status : 'ok' ,otp: OTP ,  msg: "Message Sent"})
        
        const smsSent = await sendSMS();
        if(smsSent){
            return res.status(200).json({status : 'ok' ,otp: OTP ,  msg: "OTP Sent"})
        }
        return res.status(500).json({status: 'error', msg : "OTP could not be sent"})
    }catch(error){
        console.log(error);
        return res.status(500).json({status: 'error', msg : error.message})
    }
})
//login route 
app.post("/api/login",async (req,res)=>{
    console.log(req.body);
    try{
        const user = await User.findOne({
            rollNo: req.body.rollNo
        });
        console.log(user);

        if(!user){
            console.log("no user found");
            return res.json({status:'error'});
        }
        const comparepassword = await bcrypt.compare(req.body.password,user.password);
        if(!comparepassword){
            console.log("wrong password");
            return res.json({status: 'wrongPassword',user:user,msg :"Wrong Password!!"})
        }
        
        const data={
            user:{
                id:user._id,
            }
        }
        
        const authtoken = jwt.sign(data,JWT_SECRET,{expiresIn:"1h"});
        console.log(authtoken);
        return res.json({status:'ok',authtoken:authtoken,user:user});
        
    }catch(err){
        console.log("number already registered");
        return res.json({status:'error',error:'number already registered'});
    }
})




//route to get name suggestion for crush names
app.get('/api/suggestions',async (req,res)=>{
    let {query} = req.query;
    // let query = "sunil";
    query = query.toUpperCase();
    try{
        const filteredNames = await Studentdata.find({ Name: { $regex:query, $options: 'i' }});
        res.setHeader('Content-Type', 'application/json'); 
        // console.log(filteredNames);
        console.log("query result found")
        return res.json({status : 'ok' ,names : filteredNames});

    }
    catch(err){
        console.log(err);
        return res.json({status : 'error',  msg: "Could not search for query"});
    }
})
//authentication the jwt token to get user data
app.get("/api/userAuth",fetchUser,async (req,res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        console.log(user);  
        return res.status(200).json({status:'ok',user:user});
    }
    catch(error){
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//saving the users crushdata inside the database
app.post("/api/addCrushNames",async (req,res)=>{
    console.log(req.body);
    try{
        const token = req.body.authToken;
        const data = jwt.verify(token,JWT_SECRET);
        const userId = data.user.id;
        console.log(userId);
        return res.status(200).json({status:'ok'});
    }catch(error){
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})
app.listen(5000,()=>{
    console.log("Server Running On Port 5000");
})
