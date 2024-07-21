import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
function Department() {
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/department/departmentsGet"
      );
      setDepartments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditDepartment = (id) => {
    navigate(`/updateDepartment/${id}`);
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/department/departmentsDelete/${id}`
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
        className="container "
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <h2>Department</h2>
        <Link className="dep-add m-3" to="/createDepartment">
          {" "}
          Add
        </Link>
      </div>
      <div className="depart">
        {departments.map((department) => (
          <Card
            className="card"
            key={department._id}
            style={{ width: "18rem" }}
          >
            <Card.Img variant="top" src={department.image} />
            <Card.Body>
              <Card.Title></Card.Title>
              <Card.Text> Name : {department.name}</Card.Text>
              <Card.Text> Year : {department.year}</Card.Text>
              <Card.Text>
                <div className="dropdown">
                  <span>
                    Description <FaArrowRight />
                  </span>
                  <div className="dropdown-content">
                    <p>{department.description}</p>
                  </div>
                </div>
              </Card.Text>
            </Card.Body>

            <ListGroup.Item className="card-content">
              {" "}
              <p></p>
            </ListGroup.Item>
            <ListGroup.Item className="card-content"> </ListGroup.Item>

            <Card.Body className="card-body">
              <Card.Link href="#">
                <button
                  className="edit"
                  onClick={() => handleEditDepartment(department._id)}
                >
                  <FaEdit /> Edit
                </button>
              </Card.Link>
              <Card.Link href="#">
                <button
                  className=""
                  onClick={() => handleDeleteDepartment(department._id)}
                >
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

export default Department;
