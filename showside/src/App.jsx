import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Department from './Componet/Department/Department';
import DepartmentCreate from './Componet/Department/DepartmentCreate';
import DepartmentUpdate from './Componet/Department/DepartmentUpdate';
import Sidenav from './Componet/Navbar/Navbar&Side';
import Home from './Componet/Home/Home';
import DepartHeadCreate from './Componet/DeapartHead/DepartHeadCreate';
import DepartmentHead from './Componet/DeapartHead/DepartmentHead';
import DepartHeadUpdate from './Componet/DeapartHead/DepartHeadUpdate';
import EmployeesCreate from './Componet/Employees/EmployeesCreate';
import Employees from './Componet/Employees/Employees';
import EmployeesUpdate from './Componet/Employees/EmployeesUpdate';
import Signup from './Componet/SignUp&Login/Signup';
import Login from './Componet/SignUp&Login/Login';
import DepartmentDetail from './Componet/Department/DepartDetail';
import HeadDetail from './Componet/DeapartHead/HeadDetail';

const App = () => {
  const location = useLocation();
  const [name, setAdminName] = useState(null);
  console.log(name);

  function adminName(value) {
    setAdminName(value);
  }

  return (
    <div>
      {/* Conditionally render Sidenav based on current path */}
      {location.pathname !== '/' && location.pathname !== '/login' && <Sidenav adminName={adminName} />}
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login adminName={adminName} />} />
        <Route path='/home' element={<Home />} />
        <Route path='/createDepartment' element={<DepartmentCreate />} />
        <Route path='/showAllDepartment' element={<Department />} />
        <Route path='/updateDepartment/:id' element={<DepartmentUpdate />} />
        <Route path="/departmentDetail/:name" element={<DepartmentDetail />} />
        <Route path='/headCreate' element={<DepartHeadCreate />} />
        <Route path='/showHead' element={<DepartmentHead />} />
        <Route path='/updateHead/:id' element={<DepartHeadUpdate />} />
        <Route path='/createEmploye' element={<EmployeesCreate />} />
        <Route path='/showEmploye' element={<Employees />} />
        <Route path='/updateEmploye/:id' element={<EmployeesUpdate />} />
        <Route path='/HeadDetail/:name' element={<HeadDetail />} /> 
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
