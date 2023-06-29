/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zoom } from 'react-awesome-reveal';
// import { DailyLink, ShelfLink, StatisticsLink } from '../styles/StyledLinks';
import './compCSS/UserPage.css';

const UserPage = ({ username }) => {
  const [uvIndex, setUvIndex] = useState(null);

  useEffect(() => {
    const fetchUVIndex = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/userPage', {
          // const response = await axios.get(' https://skinsync-mgydyyeela-no.a.run.app/userPage', {
          headers: {
            Authorization: accessToken
          }
        });
        const { uvIndex } = response.data;
        setUvIndex(uvIndex);
      } catch (error) {
        // console.error('Error fetching UV index:', error);
      }
    };

    fetchUVIndex();
  }, []);

  return (
    <div className="userpage-wrapper">
      <div className="overlay">
        <Zoom>
          <h1 className="welcomeh1">Welcome {username}!</h1>
        </Zoom>
        {uvIndex !== null && (
          <div className="uv-index-box">
            <h4> The UV index is:</h4>
            <span> {uvIndex} </span>
            <p>Remember to wear sunscreen!</p>
          </div>
        )}
      </div>
      <div className="ball" />
      <div className="background-img" />
    </div>
  );
};

export default UserPage;

/*
<div className="imagesandbuttons">
              <img src={statisticsImage} alt="Statistics" className="button-image3" />
              <StatisticsLink to="/statisticsPage" className="route-button">
              Statistics
              </StatisticsLink>
              */
