import React, { useEffect } from 'react';
import axios from 'axios';
import { GetStartedLink } from '../styles/StyledLinks';

const OpenPage = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    axios.get('/', {
      headers: {
        Authorization: accessToken
      }
    });
  }, []);

  return (
    <div>
      <GetStartedLink to="/login">Get Started</GetStartedLink>
    </div>
  );
}

export default OpenPage;
