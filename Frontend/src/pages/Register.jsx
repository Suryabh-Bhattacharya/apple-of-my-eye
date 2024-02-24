import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "bootstrap/dist/css/bootstrap.min.css"
import './Login.css'

function Register() {
  const navigate = useNavigate();

  const [rollNo, setRollNo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOpt] = useState('');
  const [optsent, setOptsent] = useState(0);
  
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
      navigate('/dashboard',{replace:true});
    }
    setOptsent(1);
    // console.log(data);
  }

  async function getOtp(){
    // event.preventDefault();
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
      navigate('/register',{replace:true});
    }
    // setOpt(data.otp);
    setOptsent(1);

  }

  return (
    <div>
      <Form onSubmit={registerUser} className='loginform'>
      <div className='loginTitle'><h1>Register</h1></div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>RollNo</Form.Label>
          <Form.Control type="number" 
          placeholder="Enter RollNo" 
          value={rollNo}
          onChange={(e)=>setRollNo(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control 
          type="number" 
          placeholder="Phone Number" 
          value={phoneNumber}
          onChange={(e)=>setPhoneNumber(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)} />
        </Form.Group>
        {!optsent? (
          <Button variant="primary" onClick={getOtp}>
            Get Otp
          </Button>
        ):(
          <div>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>OTP</Form.Label>
            <Form.Control 
            type="number" 
            placeholder="OTP" 
            value={otp}
            onChange={(e)=>setOpt(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" 
          type="submit"
          value="Register">
            Register
          </Button>
          </div>
        )}
      </Form>
    </div>
  )
}

export default Register
