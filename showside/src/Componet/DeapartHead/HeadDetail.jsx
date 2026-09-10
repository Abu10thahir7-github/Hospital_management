import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';

const HeadDetail = () => {
  const [department, setDepartment] = useState([]);
  const [error, setError] = useState('');

  const { name } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setError('');

        const response = await axios.get(
          'https://hospital-management-backend-f7q4.onrender.com/api/departmentHead/departHead/name',
          {
            params: { name },
          }
        );

        console.log('API Response:', response.data);

        setDepartment(response.data);
      } catch (err) {
        console.error('API Error:', err);

        setError(
          err.response?.data?.message ||
          'Failed to fetch department head details'
        );
      }
    };

    fetchDepartment();
  }, [name]);

  useEffect(() => {
    console.log('Department state:', department);
  }, [department]);

  return (
    <div className="dep-detail">
      <div className="buttn container mt-2">
        <button
          onClick={() => navigate(-1)}
          className="back-button btn"
        >
          <IoMdArrowRoundBack className="back-icon" />
          Back
        </button>
      </div>

      <div className="title">
        <h1 className="mb-3">Department Head Details</h1>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {department.map((item) => (
        <div className="de-cart" key={item._id}>
          <div className="de-img">
            {item.image && (
              <img src={item.image} alt={item.name} />
            )}
          </div>

          <div className="detail-con">
            <h2>{item.name}</h2>
            <p>Email: {item.email}</p>
            <p>Age: {item.age}</p>
            <p>Description: {item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeadDetail;