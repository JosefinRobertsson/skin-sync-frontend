/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable indent */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { BaseButton, UserFormButton, HideFormButton } from '../styles/StyledButtons';
import 'react-toggle/style.css'
import './compCSS/LandingPage.css';

const StyledRadioLabel = styled.label`
display: inline;
flex-direction: column;
padding: 0 10px 2px 5px;
gap: 10px;
background-color: #051306;
border: 1px solid #F2F2F2;
text-align: center;
color: #F2F2F2;
width: fit-content;
cursor: pointer;
box-shadow: 1px 1px 8px 4px rgba(5, 19, 6, 0.3);

@media screen and (min-width: 768px) {
    flex-direction: row;
}`;

const LandingPage = ({ username, setUsername }) => {
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity()) {
      // eslint-disable-next-line no-use-before-define
      auth(event);
      localStorage.setItem('username', username);
    } else {
      const usernameInput = form.elements.username;
      const passwordInput = form.elements.password;
      if (!usernameInput.checkValidity()) {
        usernameInput.reportValidity();
      }

      if (!passwordInput.checkValidity()) {
        passwordInput.reportValidity();
      }
    }
  };

  const auth = (event) => {
    event.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    axios
      .post(endpoint, {
        username,
        password
      })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.response.accessToken);
        if (isLogin) {
          navigate('/userPage'); // navigate to the userPage route
        } else {
          setIsLogin(true); // switch back to login view after successful registration
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorFromServer = error.response.data.message;
          alert(errorFromServer);
          console.error(error);
          setUsername('');
          setPassword('');
        } else if (error.request) {
          console.error(error.request);
          alert('No response from the server. Please try again later.');
        } else {
          console.error('Error:', error.message);
          alert('An error occurred. Please try again later.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleOnClick = () => {
    setShowForm(!showForm);
  }

  const handleLabelKeyDown = (e, value) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsLogin(value);
    }
  };

  if (loading) {
    return <p>Loading... SkinSync is hosted
      on a free web service provider.
      Please allow it some time to bringitself to life...
      </p>;
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      <div className="background-landing">
        <h1 className="landing-h1">SkinSync</h1>
        <div className="form-and-buttonContainer">
          <form id="form-login" style={{ display: showForm ? 'flex' : 'none' }} onSubmit={handleFormSubmit}>
            <fieldset>
              <legend className={`login-legend ${isLogin ? '' : 'register-legend extra'}`}>{isLogin ? 'Login' : <span id="register-legend-id">Register</span>}</legend>
              <div className="radio-button-container">
                <StyledRadioLabel htmlFor="register-radio" tabIndex="0">
                  <input
                    type="radio"
                    id="register-radio"
                    checked={!isLogin}
                    onChange={() => {
                      setIsLogin(false);
                    }}
                    onKeyDown={(e) => handleLabelKeyDown(e, false)} />
                  New account
                </StyledRadioLabel>

                <StyledRadioLabel htmlFor="login-radio" tabIndex="0">
                  <input
                    type="radio"
                    id="login-radio"
                    checked={isLogin}
                    onChange={() => {
                      setIsLogin(true);
                    }}
                    onKeyDown={(e) => handleLabelKeyDown(e, true)} />
                  Already a user
                </StyledRadioLabel>
              </div>
              <input
                type="text"
                placeholder="Username"
                minLength="1"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <input
                type="password"
                placeholder="Password"
                minLength="6"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <div className="form-button-container">
                {isLogin
                  ? <UserFormButton type="submit">Sign in</UserFormButton>
                  : <UserFormButton type="submit">Create user</UserFormButton>}
                <HideFormButton type="button" onClick={() => setShowForm(!showForm)}>Hide form</HideFormButton>
              </div>
            </fieldset>
          </form>
          <div className="description" style={{ display: showForm ? 'none' : 'flex' }}>
            <div className="description-container">
              <p>
                SkinSync is here to help you determine the effectiveness of your skincare products.
                By keeping track of all the droplets in daily life that pool up to affect your skin,
                you can take them into account to
                better assess wether or not a skincare product is right for you.
                Click the button to get started!
              </p>
            </div>
            <BaseButton
              type="button"
              onClick={handleOnClick}>
              GET STARTED
            </BaseButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
