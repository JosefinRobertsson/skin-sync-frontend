import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toggle from 'react-toggle';
import { LoginButton, RegisterButton } from '../styles/StyledButtons';
import './compCSS/Login.css';
import 'react-toggle/style.css'

/* eslint-disable no-console */

const Auth = ({ username, setUsername }) => {
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const auth = () => {
    const url = isLogin ? 'http://localhost:8080/login' : 'http://localhost:8080/register';
    // const url = isLogin ? ' https://skinsync-mgydyyeela-no.a.run.app/login' : ' https://skinsync-mgydyyeela-no.a.run.app/register';
    axios
      .post(url, {
        username,
        password
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem('accessToken', response.data.response.accessToken);
        if (isLogin) {
          navigate('/userPage'); // navigate to the userPage route
        } else {
          setIsLogin(true); // switch back to login view after successful registration
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Toggle
          icons={false}
          className="my-toggle"
          checked={isLogin}
          onChange={() => setIsLogin(!isLogin)} />
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
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
        {isLogin
          ? <LoginButton className="login-button" type="submit" onClick={auth}>Enter Now</LoginButton>
          : <RegisterButton className="register-button" type="submit" onClick={auth}>Register</RegisterButton>}
      </div>
    </div>
  );
}

export default Auth;
