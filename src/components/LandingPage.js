import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toggle from 'react-toggle';
import { LoginButton, RegisterButton } from '../styles/StyledButtons';
import 'react-toggle/style.css'
import './LandingPage.css';

const LandingPage = ({ username, setUsername }) => {
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  const handleOnClick = () => {
    setShowForm(!showForm);
  }

  return (
    <div className="background-landing">
      <h1 className="landing-h1">SkinSync</h1>
      <div className="form-and-buttonContainer">
        <form style={{ visibility: showForm ? 'visible' : 'hidden' }}>

          <h2 className="login-h2">{isLogin ? 'Login' : 'Register'}</h2>
          <Toggle
            icons={false}
            className="my-toggle"
            checked={isLogin}
            onChange={() => setIsLogin(!isLogin)} />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} />
          {isLogin
            ? <LoginButton className="login-button" type="submit" onClick={auth}>Enter Now</LoginButton>
            : <RegisterButton className="register-button" type="submit" onClick={auth}>Register</RegisterButton>}
          <p style={{ visibility: showForm ? 'hidden' : 'visible' }}>SkinSync is here to help you understand the effectiveness of your skincare routine.
            Click the button to get started!
          </p>
        </form>
        <button
          type="button"
          className="get-started-button"
          onClick={handleOnClick}>
          GET STARTED
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
