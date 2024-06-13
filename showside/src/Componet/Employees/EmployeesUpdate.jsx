import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
// import "./departhead.css";
import { IoMdArrowRoundBack } from "react-icons/io";

function EmployeesUpdate() {
  const [oldImage, setOldImage] = useState(null);
  const [DepartOption, setDepartOption] = useState([]);
  const [ReportOption, setReportOption] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [editDepartment, setEditDepartment] = useState({
    name: "",
    email: "",
    age: "",
    description: "",
    departmentOption: "",
    reportTo: "",
    image: "",
  });
  useEffect(() => {
    fetchDescriData();
    fetchReportData();
  }, []);

  const fetchDescriData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/department/departmentsGet"
      );
      const options = response.data.map((department) => ({
        value: department._id,
        label: department.name,
      }));
      setDepartOption(options);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReportData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/departmentHead/HeadGet"
      );
      const options = response.data.map((ReportTo) => ({
        value: ReportTo._id,
        label: ReportTo.name,
      }));
      setReportOption(options);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/employeGet/${id}`
        );
        setEditDepartment(response.data);
        setOldImage(response.data.image);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDepartment();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditDepartment({
        ...editDepartment,
        [name]: files[0],
      });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setEditDepartment({
        ...editDepartment,
        [name]: value,
      });
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editDepartment.name);
      formData.append("email", editDepartment.email);
      formData.append("age", editDepartment.age);
      formData.append("description", editDepartment.description);
      formData.append("departmentOption", editDepartment.departmentOption);
      formData.append("reportTo", editDepartment.reportTo);
      if (editDepartment.image instanceof File) {
        formData.append("image", editDepartment.image);
      } else {
        formData.append("image", oldImage);
      }

      await axios.put(
        `http://localhost:5000/api/employee/employeUpdate/${id}`,
        formData
      );
      // Optionally, you can reset the state or fetch the updated data again
      // fetchData(); // Call a fetch function if needed

      // setEditDepartment(null); // Reset state if needed
      alert("Department created successfully");
      navigate('/showEmploye')
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="departUpdate">
        <div className="buttn container mt-2">

<button onClick={() => navigate(-1)} className="back-button btn"> <IoMdArrowRoundBack className='back-icon' />Back</button>
</div>
      <form onSubmit={handleEditDepartment}>
        <div className="title">
          <h1>Update Employees</h1>
        </div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editDepartment.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={editDepartment.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={editDepartment.age}
          onChange={handleInputChange}
        />

        <select
          name="departmentOption" // Ensure the name matches the state key
          id="departmentOption"
          value={editDepartment.departmentOption}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Select Department
          </option>
          {DepartOption.map((department) => (
            <option key={department.value} value={department.label}>
              {department.label}
            </option>
          ))}
        </select>

        <select
          name="reportTo" // Ensure the name matches the state key
          id="reportTo"
          value={editDepartment.reportTo}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Select ReportTo
          </option>
          {ReportOption.map((ReportTo) => (
            <option key={ReportTo.value} value={ReportTo.label}>
              {ReportTo.label}
            </option>
          ))}
        </select>

        <div className="img-file-update">
          <input type="file" name="image" onChange={handleInputChange} />
          {previewImage ? (
            <img src={previewImage} alt="New" />
          ) : (
            oldImage && <img src={oldImage} alt="Old" />
          )}
        </div>
        <button type="submit">Update Department</button>
      </form>
    </div>
  );
}

export default EmployeesUpdate;
