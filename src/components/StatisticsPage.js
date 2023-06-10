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

      <h1>Chart 1</h1>

      <ResponsiveContainer width="50%" height={400}>
        <BarChart data={data} margin={{ top: 10, left: 20, right: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="acne" />
          <Tooltip />
          <Legend />
          <Bar dataKey="acne" fill="#DB5A4F" />
          <Bar dataKey="sleepHours" fill="#A996D5" />
          <Bar dataKey="waterAmount" fill="#FCD2B3" />
          <Bar dataKey="exercised" fill="#752338" />
          <Bar dataKey="stress" fill="#2A152A" />
        </BarChart>
      </ResponsiveContainer>

      <h1>Chart 2</h1>

      <ResponsiveContainer width="50%" height={400}>
        <BarChart data={data} margin={{ top: 10, left: 20, right: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="acne" />
          <Tooltip />
          <Legend />
          <Bar dataKey="acne" fill="#DB5A4F" />
          <Bar dataKey="sugar" fill="#A996D5" />
          <Bar dataKey="alcohol" fill="#FCD2B3" />
          <Bar dataKey="dairy" fill="#752338" />
          <Bar dataKey="greasyFood" fill="#2A152A" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default StatisticsPage;
