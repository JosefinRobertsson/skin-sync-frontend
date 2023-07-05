/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zoom } from 'react-awesome-reveal';
import { BaseLink } from '../styles/StyledLinks';
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
      <Zoom>
        <h1 className="welcomeh1">Welcome {username}!</h1>
      </Zoom>

      {uvIndex !== null && (
        <div className="uv-index-box">
          <span> The UV index  right now is {uvIndex}.
          </span>
          <span>Remember to wear sunscreen!</span>
        </div>
      )}
      <div className="ball" />
      <div className="link-container">
        <div><BaseLink to="/DailyReport">Log day</BaseLink><p>Answer questions about your diet and daily habits</p></div>
        <div><BaseLink to="/productShelf/logUsage">Log skincare</BaseLink><p>Check off all the products you used today</p></div>
        <div><BaseLink to="/productShelf">Product Shelves</BaseLink><p>Manage the products you are currently using</p></div>
        <div><BaseLink to="/StatisticsPage">Statistics</BaseLink><p>View all your saved statistics</p></div>
      </div>
    </div>
  );
};

export default UserPage;
