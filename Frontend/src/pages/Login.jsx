import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import "bootstrap/dist/css/bootstrap.min.css"
import './Login.css'

export default function Login() {
  
  const [rollNo, setRollno] = useState('');
  const [password, setPassword] = useState('');
  //used for alert message
  const [show, setShow] = useState(true);
  const [err,setErr] = useState(false);
  const [alerttype,setAlerttype] = useState('');
  const [alertmsg,setAlertmsg] = useState('');
  const navigate = useNavigate();
  
  const  handleClose =()=>{
    setShow(false);
    setErr(0);
    setAlerttype('');
    setAlertmsg('');
  }
  async function loginUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:5000/api/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        rollNo,
        password,
      })
    })
    console.log("api called")
    const data = await response.json();

    if(data.status === 'ok'){
      // console.log(data.authtoken);
      localStorage.setItem('token',JSON.stringify(data.authtoken));
      // localStorage.setItem('user',JSON.stringify(data.id));
      navigate('/dashboard',{replace:true})
    }
    else if(data.status === 'wrongPassword'){
      setAlerttype("danger");
      setAlertmsg(data.msg);
      setErr(1);
    }
    else{
      setAlerttype("danger");
      setAlertmsg("User Not Registered");
      setErr(1);
    }
    // console.log(data);
  }

  function alertFunc(){
    return (<Alert variant={alerttype} onClose={handleClose}  dismissible>
      <p>{alertmsg}</p>
  </Alert>);
  }

  return (
    <div className='loginpage'>
      <Form onSubmit={loginUser} className='loginform'>
      {!err ? (<></>):(alertFunc())}
      <div className='loginTitle'>
        <h1 className='mainTitle'>NITT-ine</h1>
        <h1 className='secTitle'>Sign In</h1>
      </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          {/* <Form.Label>Roll No</Form.Label> */}
          <Form.Control 
          type="rollNo" 
          placeholder="Roll No" 
          value={rollNo}
          maxLength="9"
          onChange={(e)=>setRollno(e.target.value)}
          required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)} 
          required
          />
        </Form.Group>
        <Button variant="primary" 
        type="submit"
        value="Login">
          Login
        </Button>
        <br />
        <p>not yet registered,<a href='/register'>Register Here</a></p>
        <p>If Signed In --<a href='/Dashboard'>Dashboard</a></p>
      </Form>
    </div>
  )
}

