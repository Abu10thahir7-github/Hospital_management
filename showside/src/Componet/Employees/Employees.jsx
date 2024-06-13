import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import '..css'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash,FaArrowRight } from 'react-icons/fa';
function Employees() {
  const [EmployessShow, setEmployees]  = useState([]);

  const navigate = useNavigate()
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee/employeGet");
      setEmployees(response.data);
    } catch (err) {
      console.log(err);
    }
  };



  const handleEditEmploye = (id)=>{
    navigate(`/updateEmploye/${id}`);
  }

  const handleDeleteEmploye = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employee/employeDelete/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

 
  useEffect(() => {
    fetchData();
  }, []);

  return (
  <div className='dep'>
    <div className="container " style={{ display:'flex', justifyContent:'space-between'}}>
       <h2 >Employees</h2>
    <Link className='dep-add m-3' to="/createEmploye"> Add</Link>
    </div>
  <div className='depart'>
  
     {EmployessShow.map((employe) => (
       <Card  key={employe._id} style={{ width: '18rem' ,fontSize: "14px"  }}>
      <div className="imge">

      <Card.Img variant="top" src={employe.image} />
      </div>
      <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text> name : {employe.name}</Card.Text>
        <Card.Text>Email : {employe.email}</Card.Text>
        <Card.Text>Age : {employe.age}</Card.Text>
        <Card.Text><div className='dropdown head-drop'>
          <span>Description <FaArrowRight /></span>
          <div className="dropdown-content">
            <p>{employe.description}</p>
          </div>
        </div>
        </Card.Text> 
        <Card.Text>

        <Link to={`/departmentDetail/${employe.departmentOption}`}>
                  Department: {employe.departmentOption}
                </Link>
        </Card.Text>
       
        
        <Card.Text>
        <Link to={`/HeadDetail/${employe.reportTo}`}>
                  Report To: {employe.reportTo}
                </Link> </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
 
      </ListGroup>
      <Card.Body className='' style={{display:'flex',alignItems:'center', }}>
      
      <Card.Link href="#">
            <button onClick={() => handleEditEmploye(employe._id)}>
              <FaEdit /> Edit
            </button>
          </Card.Link>
          <Card.Link href="#">
            <button onClick={() => handleDeleteEmploye(employe._id)}>
              <FaTrash /> Delete
            </button>
          </Card.Link>
      </Card.Body>
    </Card>
       ))}
       </div>
       </div>
  );
}

export default Employees;