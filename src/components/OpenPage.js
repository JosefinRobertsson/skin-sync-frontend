import React, { useEffect } from 'react';
import axios from 'axios';
import { GetStartedLink } from '../styles/StyledLinks';

const OpenPage = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    axios.get(' https://skinsync-mgydyyeela-no.a.run.app/', {
      headers: {
        Authorization: accessToken
      }
    });
  }, []);

  return (
    <div>
      <h1>
        Here we will summarize the app and say that
        we will save their data so we dont go to jail
        {' '}

      </h1>
      <GetStartedLink to="/login">Get Started</GetStartedLink>
    </div>
  );
}

export default OpenPage;
