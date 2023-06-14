import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DailyLink, ShelfLink, StatisticsLink } from '../styles/StyledLinks';
import './UserPage.css'

const UserPage = () => {
  const [uvIndex, setUvIndex] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    axios.get('http://localhost:8080/userPage', {
      headers: {
        Authorization: accessToken
      }
    })
      .then((response) => {
        setUvIndex(response.data.uvIndex);
      })
      .catch((error) => {
        console.log('Error fetching UV index:', error);
      });
  }, []);

  return (
    <>
      <div>
        <h1>Welcome Back!</h1>
        {uvIndex !== null && (
          <p>
          The UV index is:
            {' '}
            {uvIndex}
            <h2>Rember to wear sunscreen!</h2>
          </p>

        )}
      </div>
      <h2>How was your day?</h2>
      <DailyLink to="/DailyReport" className="route-button">Log day</DailyLink>
      <h2> Log your skin care here</h2>
      <ShelfLink to="/productShelf" className="route-button">Product shelf</ShelfLink>
      <h2> See your progress </h2>
      <StatisticsLink to="/statisticsPage" className="route-button">Statistics</StatisticsLink>
    </>
  );
}

export default UserPage;
