import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FcAbout } from "react-icons/fc";
import { IoPersonAdd } from "react-icons/io5";
import { MdPrivacyTip } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";

import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Navbar.css'
  import Logo from './Logo.png'
function Sidenav( {adminName}) {
  console.log(adminName);



    

    
    
  return (
    <>
      {[ false, ].map((expand) => (
        <Navbar key={expand} expand={expand} className="nav ">
          <Container fluid>
            <div className="nav-logo">

            <img src={Logo} className='logo-nav' alt="" />
            <Navbar.Brand href="#" className='logo-text'> Hospital Managment  
            </Navbar.Brand>
            </div>
            <div className="nav-pages">

            <Link to="/home"> Home</Link>
            <Link to="/showAllDepartment"> Department</Link>
            <Link to="/showHead"> Department Head</Link>
            <Link to="/showEmploye"> Employees</Link>
            </div>
            
                  {/* <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                  >
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown> */}
            <Navbar.Toggle className='nav-btn' aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
            className='side-nav'
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                 Manager
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
             
              
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#action1"><Link to="/createDepartment"> Department          <IoPersonAdd /></Link></Nav.Link>
                  <Nav.Link href="#action2">  <Link to="/headCreate"> Department Head         <IoPersonAdd /></Link></Nav.Link>
                  <Nav.Link href="#action3">  <Link to="/createEmploye"> Employees         <IoPersonAdd /></Link></Nav.Link>
                </Nav>
              </Offcanvas.Body>
                <Nav className='m-3 nav-footer'>
                    <div className="priva">
                      
                  <Nav.Link href="#">  <Link to="#"> Privacy    <MdPrivacyTip />    </Link></Nav.Link>
                  <Nav.Link href="#">  <Link to="#"> About     <FcAbout/>    </Link></Nav.Link>
                    </div>
                    <div className="admin">
                    <Link to="#"  className='user-login'> {adminName}  <FaCircleUser className='user-icon' /></Link>

                    </div>
                </Nav>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default Sidenav;