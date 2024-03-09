const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./Models/user");
const Studentdata = require("./Models/studentdata");
const Crush = require("./Models/crushdata");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "yesecrethaibhai";
const bcrypt = require("bcrypt");
const { Vonage } = require('@vonage/server-sdk');
const { stringify } = require("querystring");
const fetchUser = require("./middleware/fetchUser");
const nodemailer = require('nodemailer');
const { isNull } = require("util");
//ethereal mail
const senderName = 'Wallace Larkin';
const senderMail = 'wallace.larkin90@ethereal.email'
const senderPassword = '4N97PRpm8nSEeZ8yhf'


//sending sms to phone using vonage
/*const vonage = new Vonage({
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
}*/

let OTP;
let newuser;
//Body Parser
app.use(express.json());
//using Cors
app.use(cors());

//Database Connection
// const dbUrl = "mongodb://127.0.0.1:27017/loginpage"; 
const uri = "mongodb+srv://114121034:CUBXnA8gfWlLsVEv@cluster0.tkgrrgd.mongodb.net/Nittine?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
.then(()=>{
    console.log("MONGO CONNECTION OPEN!!!")
}).catch((err)=>{
    // console.log("Database Connected!!");
    console.log("Error connecting db",err);
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
        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(req.body.password,salt);
        console.log(salt,encryptPassword);
        const temp = new User({
            otp: req.body.otp,
            rollNo : req.body.rollNo,
            phoneNumber:req.body.phoneNumber,
            password: encryptPassword,
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
        let existinguser = await Studentdata.findOne({RollNo:rollNo});
        //checking if user rollNo is Valid
        if(!existinguser){
            console.log("USER Entered Invalid RollNo");
            return res.status(400).json({status : 'error', msg: "Enter a valid rollNo"})
        }
        // console.log("user in db",existinguser);
        //checking if user has already created an account
        existinguser = await User.findOne({rollNo:rollNo});
        if(existinguser){
            console.log("rollNo EXISTS");
            return res.status(400).json({status : 'error', msg: "roll no Already Registered!!"})
        }
        // console.log("user not registered so can register",existinguser);

        //checking if phone number is already used
        existinguser = await User.findOne({phoneNumber:phoneNumber});
        if(existinguser){
            console.log("The number is already used")
            return res.status(400).json({status : 'error', msg: "Number Already Used!!"})
        }

        newuser = new User({
            rollNo : req.body.rollNo,
            phoneNumber:req.body.phoneNumber,
            password: req.body.password,
        })
        OTP = "1234";


        //avoiding message or sending OTP(temporary for testing purpose the below code is commented)---------------------------
        // let digits = "0123456789";
        // OTP ="";
        // for( let i = 0 ; i<4;i++){
        //     OTP += digits[Math.floor(Math.random()*10)];
        // }


        /* this are the procedures to send mail using vonyage*/
        // let num = req.body.phoneNumber;
        // num = num.toString();
        // to = "+91" + num;
        // console.log(to);
        // const textmsg = `"Your OTP verification for user ${req.body.rollNo} is ${OTP}"`;


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
    // console.log(req.body);
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
    let {query,gender} = req.query;
    console.log(gender);
    query = query.toUpperCase();
    let oppGender = "";
    if(gender==='Male') oppGender = "Female";
    else oppGender = "Male";
    try{
        const filteredNames = await Studentdata.find({ Name: { $regex:query, $options: 'i' },Gender: { $regex:oppGender, $options: 'i' }});
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
        const userData = await Studentdata.findOne({RollNo:user.rollNo});
        let crushID = null;
        if(user.crushDataId){
            crushID = user.crushDataId
        }
        let crush = [];
        if(user.crushId){
            const item = await User.findById(user.crushId);
            const val = await Studentdata.findOne({RollNo:item.rollNo});
            crush.push({rollno:item.rollNo,name:val.Name,dept:val.Branch,batch:val.Batch});
        }
        let crushDATA = null;
        if(crushID){
            crushDATA = await Crush.findById(crushID);
        }
        // console.log("This is user data got from fetchUser middleware",user,crushDATA,crush);  
        return res.status(200).json({status:'ok',user:user,crushdata:crushDATA,crush:crush,userData:userData});
    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({status:'error',msg:'internal servor error'}).send("Internal Server Error");
    }
})

//saving the users crushdata inside the database
app.post("/api/addCrushNames",async (req,res)=>{
    console.log(req.body);
    try{
        const token = req.body.authToken;
        const data = jwt.verify(token,JWT_SECRET);
        const UserId = data.user.id;
        const user = await User.findById(UserId);
        const crushData = req.body.crushData;//the data we got from the user
        // console.log("crush data got from user",crushData)

        //getting all the crushs data inside an array
        let newCrushData =[];
            for(let i=0;i<crushData.length;i++){
                newCrushData.push({name:crushData[i].Name,rollno:crushData[i].RollNo});
            }
        if(user.crushDataId==null){
            //names are being added first time
            const temp =  new Crush({crushNames:newCrushData,userId:user._id});
            await temp.save();
            user.crushDataId = temp._id;
            await user.save();
            return res.status(200).json({status:'ok',msg:"Names added"});
        }
        else{
            //already contain names
            const crushDataInDb = await Crush.findById(user.crushDataId);
            crushDataInDb.crushNames = newCrushData;
            await crushDataInDb.save();
            console.log("Names updated");
            return res.status(200).json({status:'ok',msg:"Names are updated"});
        }
        
    }catch(error){
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})
//giving userData to the User
app.get("/api/getMatch",async (req,res)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(404).json({status:"error found"});
    }

    const data = jwt.verify(token,JWT_SECRET);
    if(!data){
        return res.status(400).json({staus:"error",msg:"token not found need to login again"});
    }

    try{
        const userID = data.user.id;
        const userData = await User.findById(userID);
        if(userData.crushDataId===null){return res.status(500).json({status:'error',msg:"CrushData not Found",match:false});}
        if(userData.isMatched===true){return res.status(200).json({status:'ok',msg:"Match Found Already",match:false});}
        
        // console.log("STEP 1");

        const crushDb = await Crush.findById(userData.crushDataId);
        const crushList = crushDb.crushNames;
        if(crushList.length===0){return res.status(200).json({status:'ok',msg:"CrushList is Empty",match:false});}
        const userExists = [];
        for(let i =0;i<crushList.length;i++){
            const crushItem = crushList[i];
            console.log(crushItem);
            //the crush name that we have added should be registered on our platform
            const value = await User.findOne({rollNo:crushItem.rollno});
            if(value){
                userExists.push(value);
            }
        }

        // console.log("STEP 2",userExists);
        if(userExists.length===0) return res.status(200).json({status:'ok',msg:"Sorry No Match Found",match:false});
        //Userexists consists of crushes who have registered on the website
        for(let i=0;i<userExists.length;i++){
            const crushItem = userExists[i];
            if(crushItem.isMatched===false){
                // console.log("STEP 3");
                if(crushItem.crushDataId){
                    // console.log("STEP 4");
                    const matchDATA = await Crush.findById(crushItem.crushDataId);
                    //matchData has the list of her crushes
                    const matchDatalist = matchDATA.crushNames;
                    //traversing through her list to chdck our existence
                    for(let j=0;j<matchDatalist.length;j++){
                        if(matchDatalist[j].rollno===userData.rollNo){
                            console.log("STEP 5");
                            userData.isMatched = true;
                            userData.crushId = crushItem._id;
                            await userData.save();
                            crushItem.isMatched = true;
                            crushItem.crushId = userData._id;
                            await crushItem.save();
                            console.log(userData,crushItem);
                            return res.status(200).json({status:'ok',match:true,msg:"Match Found"});
                        }
                    }
                }
            }
        }
        return res.status(200).json({status:"ok",msg:"No Match Found",match:false});
    }
    catch(error){
        console.log("error",error);
        return res.status(500).json({status:"error",msg:"Internal server error"})
    }
})

app.get('/api/removeMatch',async (req,res)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(404).json({status:"error found"});
    }
    const data = jwt.verify(token,JWT_SECRET);
    if(!data){
        return res.status(400).json({staus:"error",msg:"token not found need to login again"});
    }
    try{
        console.log();
        const userID = data.user.id;
        const userData = await User.findById(userID);
        const crushData = await User.findById(userData.crushId);
        userData.isMatched = false;
        crushData.isMatched = false;
        userData.crushId = null;
        crushData.crushId = null;
        await userData.save();
        await crushData.save();
        return res.status(200).json({status:'ok',msg:"Match Has Been removed"});
    }catch(error){
        return res.status(500).json({staus:"error",msg:"Could not complete the remove operation"});
    }
})
app.listen(5000,()=>{
    console.log("Server Running On Port 5000");
})
