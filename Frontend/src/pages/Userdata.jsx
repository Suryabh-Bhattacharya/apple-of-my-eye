import React, { useState ,useEffect} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import './Userdata.css'

export default function Userdata (){
    const navigate = useNavigate();
    const [userGender,setUserGender] = useState('');
    const [crushNames, setCrushNames] = useState([]);
    const [newName, setNewName] = useState();
    const [show, setShow] = useState(0);//for alert
    const [empty,setEmpty] = useState(0);//use to give alert that input cannot be empty
    //for getting data inside dropdown
    const [prefix, setPrefix] = useState('');
    const [nameList, setNameList] = useState([]);
    //for Modal
    const [alertmsg,setAlertmsg] = useState("");
    const [showModal,setShowModal] = useState(false);
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
                console.log(result);
                if(!(result.status==='ok')){
                    navigate('/login');
                }
                if(result.userData){
                    setUserGender(result.userData.Gender);
                }
                const crushDataFromDb = [];
                if(!(result.crushdata)){
                    return ;
                }
                const lst = result.crushdata.crushNames;
                for(let i=0;i<lst.length;i++){
                    const item = lst[i];
                    crushDataFromDb.push({'Name':item.name,'RollNo':item.rollno})
                }
                setCrushNames(crushDataFromDb);
            }catch(error){
                console.log("Error Authenticating user",error);
                navigate('/login');
            }
        }
        userAuth();
    },[]);
    //modal
    function alertModal(){
        if(alertmsg==="") return ;
        return (<>
            <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title>{alertmsg}</Modal.Title>
                </Modal.Header>
            </Modal>
        </>)
    }
    //handleClose for Modal
    const handleClose = ()=>{
        setShowModal(false);
        setAlertmsg("");
    }
//to setnew name as object
    function handleSetNewName(name,data){
        setNewName({'Name':name,'RollNo':data.rollno});
    }
    //adding names
    async function addCrushNames(event){
        event.preventDefault();
        console.log("sent request to add names to database");
        const response = await fetch('http://localhost:5000/api/addCrushNames',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                authToken :JSON.parse(localStorage.getItem('token')),
                crushData:crushNames
            })
        })
        const data = await response.json();
        if(data.status==="ok"){
            console.log(data.msg);
            setAlertmsg(data.msg);
            setShowModal(1);
            // navigate('/dashboard',{replace:true});
        }
        else{
            setAlertmsg(data.msg);
            setShowModal(1);
        }
        navigate('/Userdata');
    }
//it handles from getting suggestion to setting prefix
    const handleInputChange = async (e) => {
        const prefix = e.target.value;
        setPrefix(prefix);
        if(prefix.length>2){
            try {
                const response = await fetch(`http://localhost:5000/api/suggestions?query=${prefix}&gender=${userGender}`)
                const data = await response.json();
                if(data.status === 'ok'){
                    // console.log(data.names);
                    setNameList(data.names);
                    console.log("got all suggestions with prefix")
                }
            } catch (error) {
                console.error('Error fetching names:', error);
            }
        }
        else{
            setNameList([]);
        }
    };
//adding and deleting stuff
    const handleAddName = () => {
        // console.log(newName);
        if (newName && crushNames.length < 4) {
            setCrushNames([...crushNames, newName]);
            setNewName();
        }
        else{
            if(!newName){
                setEmpty(1);
            }
            else{
                setShow(1);
            }
        }
        setNewName();
    };

    const handleDeleteName = (index) => {
        const updatedNames = [...crushNames];
        updatedNames.splice(index, 1);
        setCrushNames(updatedNames);
    };

    function alertFunc(){
        return (<Alert variant="danger" onClose={()=>setShow(0)}  dismissible>
          <p>You can add atmost 4 names</p>
      </Alert>);
    }
    function alertforEmpty(){
        return (<Alert variant="danger" onClose={()=>setEmpty(0)}  dismissible>
          <p>select names from dropdown</p>
      </Alert>);
    }
    const handleDashboard =()=>{
        navigate('/Userdata');
    }
  return (
    
    <div className='info'>
        {alertModal()}
        {show ? (alertFunc()):(<></>)}
        {empty ? (alertforEmpty()):(<></>)}
        <Form onSubmit={addCrushNames} className='infoform'>
            <h1>Add Crush Names</h1>
            <Form.Group className="mb-3" controlId="ControlTextarea4">
                <Form.Control type='text'
                    placeholder='Enter crush name'
                    value={prefix}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Select onChange={(e) => handleSetNewName(e.target.value, e.target.selectedOptions[0].dataset)}>
                <option value={""}>Select names from dropdown</option>
                    {nameList.map((data, index) => (
                        <option key={index} value={data.Name} data-rollno={data.RollNo}>
                            {"Name:"}{data.Name}{"/"}{"RollNo:"}{data.RollNo}{"/"}{"Dept:"}{data.Branch}{"/"}{"Batch:"}{}
                        </option>
                    ))}
            </Form.Select>
            <Button variant="primary" onClick={handleAddName}>Add</Button>
            <br></br>
            <p>Crush List (Priority Matter's)</p>
            <ListGroup as="ol" numbered>
                {crushNames.map((data,index)=>(
                    <ListGroup.Item as="li" key={index} variant='info' className='list-item'>
                        Name:{data.Name}/RollNo:{data.RollNo}   
                        <Button variant="danger" onClick={() => handleDeleteName(index)}>Delete</Button>
                    </ListGroup.Item>
                    
                ))}
            </ListGroup>
            <Button variant="success" type="submit">Submit</Button>
            <p> <a href='/Dashboard'>Dashboard</a></p>
        </Form>
    </div>
  )
}
