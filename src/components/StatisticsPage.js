import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsPage = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.log('No access token found');
          return;
        }
        const config = {
          headers: {
            Authorization: accessToken
          }
        };
        const reportResponse = await axios.get('http://localhost:8080/dailyReport', config);
        console.log('fullDailyReport:', reportResponse.data);
        if (reportResponse.data.success) {
          setData(reportResponse.data.response);
        } else {
          throw new Error('Failed to fetch daily report');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  console.log('data for barchart:', data);

  return (
    <div>
      <h1>Chart</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 10, left: 20, right: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="waterAmount" />
          <Tooltip />
          <Legend />
          <Bar dataKey="waterAmount" fill="#8884d8" />
          <Bar dataKey="sleepHours" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsPage;
