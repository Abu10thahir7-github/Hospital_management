import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './employe.css.'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
function EmployeesCreate() {
    const navigate = useNavigate()
    const [DepartOption, setDepartOption] = useState([]);
    const [ReportOption, setReportOption] = useState([]);
    const [prevImage, setPrevImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        description: '',
        departmentOption: '', // Ensure this matches the select element's name attribute
        reportTo: '', // Ensure this matches the select element's name attribute
        image: null
    });

    useEffect(() => {
        fetchDescriData();
        fetchReportData();
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
   //REPORT OPTION IMPORT
    const fetchReportData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/departmentHead/HeadGet");
            const options = response.data.map(ReportTo => ({
                value: ReportTo._id,
                label: ReportTo.name
            }));
            setReportOption(options);
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
        formDataToSend.append('reportTo', formData.reportTo);

        axios.post('http://localhost:5000/api/employee/employeAdd', formDataToSend)
            .then((response) => {
                console.log(response.data);
                navigate('/showEmploye')
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
                    <h2 className='text-center'> Employees Create</h2>
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

                    <select
                        name="reportTo" // Ensure the name matches the state key
                        id="reportTo"
                        value={formData.reportTo}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select ReportTo</option>
                        {ReportOption.map((ReportTo) => (
                            <option key={ReportTo.value} value={ReportTo.label}>
                                {ReportTo.label}
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

export default EmployeesCreate;
