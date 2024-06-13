import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Log&Sig.css';
import login_img from './login-img.jpg';

function Login({ adminName }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for animation
    const [showWelcome, setShowWelcome] = useState(false); // New state for welcome message
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        adminName(name);
    }, [name]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/login', { email, password })
            .then(res => {
                console.log(res.data.name);
                setName(res.data.name);
                console.log(res.data);
                if (res.data.status === "success") {
                    setIsLoggedIn(true); // Trigger the animation
                    setShowWelcome(true); // Show welcome message
                    setTimeout(() => {
                        if (res.data.role === "admin") {
                            navigate("/home");
                        } else {
                            navigate('/home');
                        }
                        setShowWelcome(false); // Hide welcome message after navigation
                    }, 1000); // Adjust the timeout to match your animation duration
                }
            })
            .catch(err => {
                console.log(err);
                setError(err.response?.data?.message || 'An error occurred');
            });
    };

    return (
        <div className={`login ${isLoggedIn ? 'logged-in' : ''}`}>
            <div className="content-log">
                <div className="form">

                    <h2 className='text-center '>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input 
                                type="email" 
                                placeholder='Email'
                                autoComplete='off'
                                name='email'
                                required
                                className='form-control rounded-0'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                placeholder='Password'
                                autoComplete='off'
                                required
                                name='password'
                                className='form-control rounded-0'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="login-btn">
                            <button type='submit' className='btn btn-success border w-100 bg-primary'>Login</button>
                        </div>
                    </form>
                    <Link to="/"> 
                    <p>Do not have an account?</p>
                    </Link>
                    <Link to="/" className=' '>Sign up</Link>
                    {error && <p className='err'>{error}</p>}
                </div>
                <div className="login-img">
                    <img src={login_img} alt="Login illustration" />
                </div>
            </div>
            {showWelcome && (
                <div className="welcome-overlay">
                    <h1>Welcome, {name}!</h1>
                </div>
            )}
        </div>
    );
}

export default Login;
