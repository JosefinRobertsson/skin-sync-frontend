import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DailyLink, ShelfLink, StatisticsLink } from '../styles/StyledLinks';

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
        <h1>This is the user page</h1>
        {uvIndex !== null && (
          <p>
          The UV index is:
            {' '}
            {uvIndex}
          </p>
        )}
      </div>
      <DailyLink to="/DailyReport">Log day</DailyLink>
      <ShelfLink to="/productShelf">Product shelf</ShelfLink>
      <StatisticsLink to="/statisticsPage">Statistics</StatisticsLink>
    </>
  );
}

export default UserPage;
