import  express  from "express";
import mongoose from "mongoose";
const app = express();

const dbUrl ="mongodb://127.0.0.1:27017/datingApp"; 
mongoose.connect(dbUrl)
.then(()=>{
    console.log("MONGO CONNECTION OPEN!!!")
}).catch((err)=>{
    console.log("Database Connected!!");
    console.log(err);
})

app.get("/",(req,res)=>{
    res.send("THIS IS THE BACKEND");
})

app.listen(5000,()=>{
    console.log("Server Running On Port 5000")
})




