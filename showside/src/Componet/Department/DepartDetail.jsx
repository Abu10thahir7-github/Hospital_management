import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
const DepartmentDetail = () => {
  const [department, setDepartment] = useState([]);
  const [error, setError] = useState([]);
  const { name } = useParams();
  const navigate = useNavigate();

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/department/departments/name`,
        {
          params: { name },
        }
      );
      console.log("API Response:", response.data); // Log API response
      setDepartment(response.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [name]);

  useEffect(() => {
    console.log("Department state:", department); // Log department state
  }, [department]);

  return (
    <div className="dep-detail">
      <div className="buttn container mt-2">
        <button onClick={() => navigate(-1)} className="back-button btn">
          {" "}
          <IoMdArrowRoundBack className="back-icon" />
          Back
        </button>
      </div>
      <div className="title">
        <h1 className="mb-3">Department Details</h1>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {department.map((department) => (
        <div className="de-cart" key={department._id}>
          <div className="de-img text-center">
            {department.image && (
              <img src={department.image} alt={department.name} />
            )}
            <h2>{department.name}</h2>
            <p>Year: {department.year}</p>
          </div>
          <div className="detail-con">
            <p> {department.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentDetail;
