import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "bootstrap/dist/css/bootstrap.min.css"
import './Login.css'

function Register() {
  const navigate = useNavigate();

  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function registerUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:5000/api/register',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        rollNo,
        email,
        password,
      })
    })

    const data = await response.json();
    if(data.status === 'ok'){
      navigate('/login',{replace:true});
    }
    // console.log(data);
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


        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
          type="email" 
          placeholder="Enter email" 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)} 
          />
        </Form.Group>
        <Button variant="primary" 
        type="submit"
        value="Register">
          Register
        </Button>
      </Form>
    </div>
  )
}

export default Register
