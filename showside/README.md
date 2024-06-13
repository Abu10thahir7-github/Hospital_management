import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
function Department() {
  const [departments, setDepartments]  = useState([]);

  const navigate = useNavigate()
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department/departmentsGet");
      setDepartments(response.data);
    } catch (err) {
      console.log(err);
    }
  };



  const handleEditDepartment = (id)=>{
    navigate(`/updateDepartment/${id}`);
  }

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/department/departmentsDelete/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

 
  useEffect(() => {
    fetchData();
  }, []);

  return (
     {departments.map((department) => (
    <Card  key={department._id} style={{ width: '18rem' }}>
      <Card.Img variant="top" src={department.image}  style={{ width: '100px' }} />
      <Card.Body>
        <Card.Title>{department.name}</Card.Title>
        <Card.Text></Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>  <p>Year: {department.year}</p></ListGroup.Item>
        <ListGroup.Item> <p>Description: {department.description}</p></ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href="#"> <button onClick={() => handleEditDepartment(department._id)}>Edit</button></Card.Link>
        <Card.Link href="#">            <button onClick={() => handleDeleteDepartment(department._id)}>Delete</button>
</Card.Link>
      </Card.Body>
    </Card>
       ))}
  );
}

export default KitchenSinkExample;