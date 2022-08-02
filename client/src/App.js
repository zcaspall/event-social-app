import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Login from './routes/login/login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const checkStatus = async () => {
    const 
  }

  const login = () => {
    navigate('/login');
  }

  return (
    <>
      { checkStatus }
    </>
  );
}

export default App;