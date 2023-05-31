/* eslint-disable no-shadow */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */

import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    axios
      .post('http://localhost:8080/register', {
        username,
        password,
      })
      .then((response) => {
        console.log(response);
        // Assuming the server sends back the access token after a successful registration
        const token = response.data.accessToken;
        localStorage.setItem('accessToken', token);

        // Now we can make a call to the secure endpoint
        axios.get('http://localhost:8080/secure-endpoint', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button type="button" onClick={register}>Register</button>
    </div>
  );
}

export default Register;
