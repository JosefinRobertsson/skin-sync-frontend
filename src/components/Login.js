/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../styles/StyledButtons';
import './Login.css';
/* eslint-disable no-console */

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = () => {
    axios
      .post('http://localhost:8080/login', {
        username,
        password
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem('accessToken', response.data.response.accessToken);
        navigate('/userPage'); // navigate to the dailyreport route
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)} />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />
      <LoginButton className="login-button" type="submit" onClick={login}>Login</LoginButton>
    </div>
  );
}

export default Login;
