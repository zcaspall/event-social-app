import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './register.css';
import { ReactComponent as RegisterSvg } from './registerSvg.svg';   

export default function Register() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = { firstname, lastname, username, email, password, confirmedPassword };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                try {
                    navigate('/login');
                } catch (err) {
                    console.error("Failed to parse json response");
                }
            } else {
                if (response.status === 400) {
                    const data = await response.json();

                    const errors = data.errors;

                    setErrors(errors);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <RegisterSvg id="register-svg" />
            <div id="register-container">
                <form id="register-form">
                    <h1>Create an Account</h1>
                    <div id="error-container">
                        {errors.map((error) => (
                            <p className="error-message">{error}</p>
                        ))}
                    </div>
                    <div className='register-input-container'>
                        <label htmlFor="firstname" className="register-form-label">First Name</label>
                        <input type="text" name="firstname" className="register-form-input" 
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}/>
                    </div>
                    <div className='register-input-container'>
                        <label htmlFor="lastname" className="register-form-label">Last Name</label>
                        <input type="text" name="lastname" className="register-form-input"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)} />
                    </div>
                    <div className='register-input-container'>
                        <label htmlFor="username" className="register-form-label">Username</label>
                        <input type="text" name="username" className="register-form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='register-input-container'>
                        <label htmlFor="password" className="register-form-label">Password</label>
                        <input type="password" name="password" className="register-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='register-input-container'>
                        <label htmlFor="confirm-password" className="register-form-label">Confirm Password</label>
                        <input type="password" name="confirm-password" className="register-form-input"
                            value={confirmedPassword}
                            onChange={(e) => setConfirmedPassword(e.target.value)} />
                    </div>
                    <div className='register-input-container'>
                        <label htmlFor="email" className="register-form-label">Email</label>
                        <input type="email" name="email" className="register-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='register-input-container'>
                        <button id="register-button"
                            onClick={handleSubmit}>Register</button>
                    </div>
                </form>
            </div>
        </>
    )
}