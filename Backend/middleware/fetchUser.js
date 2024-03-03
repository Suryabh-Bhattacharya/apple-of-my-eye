const jwt = require("jsonwebtoken");
const JWT_SECRET = "yesecrethaibhai";
//this function will check the token send from frontend if token dont exist then it will send error or
//it will set the req.user with the user data associated with the user so that it could be sent into the frontend
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        console.log("TOKEN NOT FOUND");
        res.status(401).send({status:"error",error: "Please authenticate the user"})
    }
    try{
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
        console.log("TOKEN HAS BEEN MODIFIED");
        res.status(401).send({status:"error",error: "Please authenticate the user"});
    }
}

module.exports = fetchUser;
