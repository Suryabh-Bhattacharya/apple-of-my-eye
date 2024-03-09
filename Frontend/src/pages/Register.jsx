import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import "bootstrap/dist/css/bootstrap.min.css"
import './Register.css'

function Register() {
const navigate = useNavigate();

  const [rollNo, setRollNo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOpt] = useState('');
  const [optsent, setOptsent] = useState(0);
  const [show, setShow] = useState(true);
  const [err,setErr] = useState(false);
  const [alerttype,setAlerttype] = useState('');
  const [alertmsg,setAlertmsg] = useState('');
  const  handleClose =()=>{
    setShow(false);
    setErr(0);
    setAlerttype('');
    setAlertmsg('');
  }

  function alertFunc(){
    return (<Alert variant={alerttype} onClose={handleClose} dismissible>
      <p>{alertmsg}</p>
  </Alert>);
  }
  
  async function registerUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:5000/api/register',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        rollNo,
        phoneNumber,
        password,
        otp
      })
    })

    const data = await response.json();
    if(data.status === 'ok'){
      navigate('/login',{replace:true});
    }
    // console.log(data);
  }

  async function getOtp(){
    // event.preventDefault();
    if (!rollNo || !phoneNumber || !password) {
      setAlerttype("danger");
      setAlertmsg("Please fill out all fields.");
      setErr(true);
      return;
    }
    if(rollNo.length!==9){
      setAlerttype("danger");
      setAlertmsg("Enter a valid rollNo");
      setErr(true);
      return;
    }
    if(phoneNumber.length!==10){
      setAlerttype("danger");
      setAlertmsg("Enter a valid 10 digit number");
      setErr(true);
      return;
    }
    
    const response = await fetch('http://localhost:5000/api/getOtp',{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        rollNo,
        phoneNumber,
        password,
      })
    });
    const data = await response.json();
    if(data.status === 'error'){
      setAlerttype("danger")
      setAlertmsg(data.msg);
      setErr(true);
      navigate('/register',{replace:true});
    }
    else{
      setAlerttype("success")
      setAlertmsg(data.msg);
      setOptsent(1);
    }
  }

  return (
    <div className='register'>
      {!err ? (<></>):(alertFunc())}
      <Form onSubmit={registerUser} className='registerform'>
      <div className='registerTitle'>
          <h1 className='mainTitle'>NITT-ine</h1>
          <h1 className='secTitle'>Register</h1>
      </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          {/* <Form.Label>RollNo</Form.Label> */}
          <Form.Control type="text" 
          placeholder="Enter RollNo" 
          value={rollNo}
          maxLength="9"
          onChange={(e)=>setRollNo(e.target.value)}
          required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="">
          {/* <Form.Label>Phone Number</Form.Label> */}
          <Form.Control 
          type="tel" 
          placeholder="without +91" 
          maxLength="10"
          value={phoneNumber}
          onChange={(e)=>setPhoneNumber(e.target.value)}
          required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control 
          type="password" 
          placeholder="Password" 
          value={password}
          minLength="7"
          onChange={(e)=>setPassword(e.target.value)} 
          required/>
        </Form.Group>
        {!optsent? (
          <Button variant="primary" onClick={getOtp}>
            Get Otp
          </Button>
        ):(
          <div className='resisterform'>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>OTP</Form.Label>
            <Form.Control 
            type="text" 
            placeholder="OTP" 
            value={otp}
            onChange={(e)=>setOpt(e.target.value)}
            required
            />
          </Form.Group>
          <Button variant="primary" 
          type="submit"
          value="Register">
            Register
          </Button>
          </div>
        )}
        <br/><br/>
        <p>Already Registered,<a href='/login'>Login Here</a></p>
      </Form>
    </div>
  )
}

export default Register
