import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Dashboard(){
    const navigate = useNavigate();
    const [crushNames, setCrushNames] = useState([]);
    const [isMatched,setIsMatched] = useState(false);
    //user data
    const [user,setUser] = useState(null);
    const [rollNo,setRollNo] = useState();
    const [phone,setPhone] = useState();
    const [userName,setUserName] = useState("");
    const [userDept,setUserDept] = useState("");
    const [userGender,setUserGender] = useState("");
    const [userBatch,setUserBatch] = useState("");

    //error
    const [error,setError] = useState(0);
    //for Modal
    const [alertmsg,setAlertmsg] = useState("");
    const [show, setShow] = useState(false);
    const [removeAlert,setRemoveAlert] = useState(false);//to use whether or not to show the button on running api call
    //saving crush Data
    const [crushId,setCrushId] = useState();
    const [crushNAME,setCrushNAME] = useState("");
    const [crushRollNo , setCrushRoll] = useState("");
    const [crushDept,setCrushDept] = useState("");
    const [crushBatch,setCrushBatch] = useState("");
    //use effect code that has user auth
    useEffect(()=>{
        async function userAuth(){
            try{
                console.log("sent request for user auth");
                let result = await fetch('http://localhost:5000/api/userAuth',{
                    headers:{
                        "auth-token":JSON.parse(localStorage.getItem('token')),
                    }
                });
                if(!result){
                    navigate('/login');
                }
                result = await result.json();
                // console.log(result);
                if(!(result.status==='ok')){
                    navigate('/login');
                }
                const crushDataFromDb = [];
                if(!(result.user)){
                    return ;
                }
                if(result.user){
                    setUser(result.user._id);
                    setIsMatched(result.user.isMatched);
                    setRollNo(result.user.rollNo);
                    setCrushId(result.user.crushId);
                    setPhone(result.user.phoneNumber);
                }
                if(result.userData){
                    setUserName(result.userData.Name);
                    setUserBatch(result.userData.Batch);
                    setUserDept(result.userData.Branch);
                    setUserGender(result.userData.Gender);
                }
                if(result.user.crush){
                    setCrushNAME(result.crush[0].name);
                    setCrushRoll(result.crush[0].rollno);
                    setCrushDept(result.crush[0].dept);
                    setCrushBatch(result.crush[0].batch);
                }
                if(result.crushdata){
                    const lst = result.crushdata.crushNames;
                    for(let i=0;i<lst.length;i++){
                        const item = lst[i];
                        crushDataFromDb.push({'Name':item.name,'RollNo':item.rollno})
                    }
                    setCrushNames(crushDataFromDb);
                }
            }catch(error){
                console.log("Error Authenticating user",error);
                navigate('/login');
            }
        }
        userAuth();
    },[]);

    const handleClose = () => {
        setShow(false);
        setAlertmsg("");
        window.location.reload();//reloading the page
    }
    const confirmremoveMatch = ()=>{
        setAlertmsg("Confirm to Remove the Match");
        setRemoveAlert(1);//this brings that extra button inside the modal so that we can do api call
        setShow(1);
    } 
    function alertModal(){
        if(alertmsg==="") return ;
        return (<>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title>{alertmsg}</Modal.Title>
                </Modal.Header>
                {removeAlert ? (<Modal.Footer><Button variant="info" onClick={removeMatch}>Confirm</Button></Modal.Footer>):(<></>)}
                
            </Modal>
        </>)
    }

    const getMatch = async ()=>{
        try{
            console.log("Api request send for getting match")
            const response = await fetch('http://localhost:5000/api/getMatch',{
                headers:{
                    "auth-token":JSON.parse(localStorage.getItem('token')),
                }
            });
            // console.log(response);
            const data = await response.json();
            console.log(data);
            if(data.status==='ok'){
                console.log(data.msg );
                setAlertmsg(data.msg+ " Try Refreshing the page");
                setShow(true);
            }
            else{
                setAlertmsg(data.msg);
                setShow(true);
            }

        }catch(error){
            console.log("error",error);
        }
    } 
    
    const removeMatch = async ()=>{
        setShow(false);
        setAlertmsg("");
        setRemoveAlert(false);
        console.log("Api request send for getting match")
        try{
            const response = await fetch('http://localhost:5000/api/removeMatch',{
                headers:{
                    "auth-token":JSON.parse(localStorage.getItem('token')),
                }
            });
            const data = await response.json();
            console.log(data);
            if(data.status==='ok'){
                console.log(data.msg );
                setAlertmsg(data.msg+ " Try Refreshing the page");
                setShow(true);
            }
            else{
                setAlertmsg(data.msg);
                setShow(true);
            }
        }catch(error){
            console.log(error);
        }
        console.log("removed");
    }
    const handleUpdate =()=>{
        navigate('/Userdata');
    }
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/login');
    }
    const handleHome =()=>{
        navigate('/');
    }
    return (
        <div className='container'>
            {alertModal()}
            <div className='profile'>
                <h2>My Profile</h2>
                <p className='rollNO'>Roll No: {rollNo}</p>
                <p className='phone'>Mobile Number: {phone}</p>
                <p>Name : {userName}</p>
                <p>Department : {userDept}</p>
                <p>Batch : {userBatch}</p>
                <p>Gender : {userGender}</p>

            </div>
            <div className='crushData'>
                <h2>My Crush List</h2>
                <ol>
                {crushNames.map((item,index)=>(
                    // <li id={index} key={index}>Name: {item.Name}, Roll No: {item.RollNo}</li>
                    <p id={index} key={index}>Name: {item.Name}, Roll No: {item.RollNo}</p>
                ))}
                </ol>
                <Button variant='info' className='button' onClick={handleUpdate}>Update</Button>
            </div>
            <div className='result'>
                <h2>result content</h2>
                {isMatched ? (`"Your Match :${crushNAME} roll:${crushRollNo} from ${crushDept} Batch:${crushBatch}"`):("Match not Found")}
                <br></br>
                {isMatched ? (<Button variant='info' className='button' onClick={confirmremoveMatch}>remove Match</Button>):(<Button variant='info' className='button' onClick={getMatch}> Get Match</Button>)}
            </div>
            <Button variant='info' className='button' onClick={handleLogout}>Logout</Button>
            <p><a href="/">Home</a></p>
        </div>
    )
}
