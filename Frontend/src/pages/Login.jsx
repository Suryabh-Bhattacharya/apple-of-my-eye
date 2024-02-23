import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "bootstrap/dist/css/bootstrap.min.css"
import './Login.css'

export default function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function loginUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:5000/api/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    })

    const data = await response.json();
    if(data.status === 'ok'){
      navigate('/dashboard',{replace:true})
    }
    console.log(data);
  }
  return (
    <div>
      <Form onSubmit={loginUser} className='loginform'>
      <div className='loginTitle'><h1>Login</h1></div>
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
        value="Login">
          Login
        </Button>
      </Form>
    </div>
  )
}

