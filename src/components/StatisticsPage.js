import React, { useEffect } from 'react';
import axios from 'axios';

const StatisticsPage = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    axios.get('http://localhost:8080/statisticsPage', {
      headers: {
        Authorization: accessToken
      }
    });
  }, []);

  return (
    <div>
      <h1>This is the Statistics Page</h1>
    </div>
  );
}

export default StatisticsPage;
