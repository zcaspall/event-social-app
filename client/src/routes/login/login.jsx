import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { ReactComponent as FriendSvg } from '../../friendSvg.svg';
import './login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();

        const data = { username, password };
        
        try {
            const response = fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }) 

            if (response.ok) {
                try {
                    navigate('/');
                } catch (err) {
                    console.error("Failed to parse json response");
                }
            } else {
                
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <FriendSvg id="friend-svg" />
            <div id="login-container">
                <form id="login-form">
                    <h1>Login</h1>
                    <div id="username-container" className='input-container'>
                        <label htmlFor="username" className="login-form-label">Username</label>
                        <input type="text" name="username" className="login-form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div id="password-container" className='input-container'>
                        <label htmlFor="password" className="login-form-label" >Password</label>
                        <input type="password" name="password" className="login-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button id="login-button" 
                            onClick={ login }>Login</button>
                    <Link to="/register"> Or Create An Account!</Link>
                </form>
            </div>
        </>
    );
}