import React, { useState } from 'react';
import axios from 'axios';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
function DepartmentCreate() {
    const navigate = useNavigate()
    const [prevImage, setPrevImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        year: '',
        description: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
        setPrevImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('year', formData.year);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('image', formData.image);

        axios.post('http://localhost:5000/api/department/departmentsAdd', formDataToSend)
            .then((response) => {
                console.log(response.data);
               navigate('/showAllDepartment')
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className='departCreate'>
            <div className="container">

                  <button onClick={() => navigate(-1)} className="back-button btn"> <IoMdArrowRoundBack className='back-icon' />Back</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="title">
                    <h2 className='text-center'>Create Department</h2>
                </div>
                <div>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        placeholder='Name'
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        name="year"
                        id="year"
                        placeholder='Year'
                        value={formData.year}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        placeholder='Description'
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className='create-Image'>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        placeholder='Image'
                        onChange={handleFileChange}
                    />
                    {prevImage && <img src={prevImage} alt="Preview" />}
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default DepartmentCreate;
