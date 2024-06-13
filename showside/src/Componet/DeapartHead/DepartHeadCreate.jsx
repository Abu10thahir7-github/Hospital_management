import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
function DepartHeadCreate() {
    const navigate = useNavigate()
    const [DepartOption, setDepartOption] = useState([]);
    const [prevImage, setPrevImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        description: '',
        departmentOption: '', // Ensure this matches the select element's name attribute
        image: null
    });

    useEffect(() => {
        fetchDescriData();
    }, []);

    const fetchDescriData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/department/departmentsGet");
            const options = response.data.map(department => ({
                value: department._id,
                label: department.name
            }));
            setDepartOption(options);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });
            setPrevImage(URL.createObjectURL(file));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('image', formData.image);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('departmentOption', formData.departmentOption);

        axios.post('http://localhost:5000/api/departmentHead/HeadAdd', formDataToSend)
            .then((response) => {
                console.log(response.data);
                navigate('/showHead')
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className='headCreate'>
              <div className="buttn container mt-2">

<button onClick={() => navigate(-1)} className="back-button btn"> <IoMdArrowRoundBack className='back-icon' />Back</button>
</div>
            <form onSubmit={handleSubmit}>
                <div className="title">
                    <h2 className='text-center'> Department Head Create</h2>
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
                        type="text"
                        name="email"
                        id="email"
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                        </div>
                    <input
                        type="number"
                        name="age"
                        id="age"
                        placeholder='Age'
                        value={formData.age}
                        onChange={handleChange}
                    />
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
                    <select
                        name="departmentOption" // Ensure the name matches the state key
                        id="departmentOption"
                        value={formData.departmentOption}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select Department</option>
                        {DepartOption.map((department) => (
                            <option key={department.value} value={department.label}>
                                {department.label}
                            </option>
                        ))}
                    </select>
                <div className='create-Image'>
                    <input
                    className='file'
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleFileChange}
                    />
                    {prevImage && <img src={prevImage} alt="Preview" />}
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default DepartHeadCreate;
