// src/components/Department.js

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
function DepartmentHead() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  console.log(departments);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/departmentHead/HeadGet"
      );
      setDepartments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditDepartment = (id) => {
    navigate(`/updateHead/${id}`);
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/departmentHead/HeadDelete/${id}`
      );
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dep">
      <div
        className="container"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h2>Department Head</h2>
        <Link className="dep-add m-3" to="/headCreate">
          Add
        </Link>
      </div>
      <div className="depart">
        {departments.map((department) => (
          <Card key={department._id} style={{ width: "18rem" }}>
            <Card.Img variant="top" src={department.image} />
            <Card.Body>
              <Card.Title>{department.name}</Card.Title>
              <Card.Text>Email: {department.email}</Card.Text>
              <Card.Text>Age: {department.age}</Card.Text>
              <Card.Text>
                <div className="dropdown head-drop">
                  <span>
                    Description <FaArrowRight />
                  </span>
                  <div className="dropdown-content">
                    <p>{department.description}</p>
                  </div>
                </div>
              </Card.Text>{" "}
              <Card.Text>
                <Link to={`/departmentDetail/${department.departmentOption}`}>
                  Department: {department.departmentOption}
                </Link>
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush"></ListGroup>
            <Card.Body>
              <Card.Link href="#">
                <button onClick={() => handleEditDepartment(department._id)}>
                  <FaEdit /> Edit
                </button>
              </Card.Link>
              <Card.Link href="#">
                <button onClick={() => handleDeleteDepartment(department._id)}>
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

export default DepartmentHead;
