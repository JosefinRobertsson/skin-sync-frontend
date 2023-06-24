/* eslint-disable no-shadow */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */

import React, { useState } from 'react';
import axios from 'axios';
import { RegisterButton } from '../styles/StyledButtons';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    // axios.post('http://localhost:8080/register', {
    axios
      .post(' https://skinsync-mgydyyeela-no.a.run.app/register', {
        username,
        password
      })
      .then((response) => {
        console.log(response);
        const token = response.data.accessToken;
        localStorage.setItem('accessToken', token);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />
      <RegisterButton type="submit" onClick={register}>Register</RegisterButton>
    </div>
  );
}

export default Register;
