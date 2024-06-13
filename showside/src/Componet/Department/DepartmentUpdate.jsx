import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams ,useNavigate} from 'react-router-dom';

import { IoMdArrowRoundBack } from "react-icons/io";
function DepartmentUpdate() {
  const [oldImage, setOldImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { id } = useParams();
  const [editDepartment, setEditDepartment] = useState({
    name: '',
    year: '',
    description: '',
    image: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/department/departmentsGet/${id}`);
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
        [name]: files[0]
      });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setEditDepartment({
        ...editDepartment,
        [name]: value
      });
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editDepartment.name);
      formData.append('year', editDepartment.year);
      formData.append('description', editDepartment.description);
      if (editDepartment.image instanceof File) {
        formData.append('image', editDepartment.image);
      } else {
        formData.append('image', oldImage);
      }

      await axios.put(`http://localhost:5000/api/department/departmentsUpdate/${id}`, formData);
      // Optionally, you can reset the state or fetch the updated data again
      // fetchData(); // Call a fetch function if needed

      // setEditDepartment(null); // Reset state if needed
      alert('Department created successfully');
      navigate('/showAllDepartment')
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='departUpdate'>
        <div className="buttn container mt-2">

<button onClick={() => navigate(-1)} className="back-button btn"> <IoMdArrowRoundBack className='back-icon' />Back</button>
</div>
      <form onSubmit={handleEditDepartment}>
      <div className="title">

      <h1>Update Department</h1>
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
          name="year"
          placeholder="Year"
          value={editDepartment.year}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={editDepartment.description}
          onChange={handleInputChange}
        />
        <div className="img-file-update">

        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          />
        {previewImage ? (
          <img src={previewImage} alt="New"  />
        ) : (
          oldImage && <img src={oldImage} alt="Old" />
        )}
        </div>
        <button type="submit">Update Department</button>
      </form>
    </div>
  );
}

export default DepartmentUpdate;
