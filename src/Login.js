/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import axios from 'axios';
/* eslint-disable no-console */

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    axios
      .post('http://localhost:8080/login', {
        username,
        password,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem('accessToken', response.data.response.accessToken);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={login}>Login</button>
    </div>
  );
}

export default Login;
