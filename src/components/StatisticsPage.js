import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsPage = () => {
  const [data, setData] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/dailyReport', {
          headers: {
            Authorization: accessToken
          }
        });
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/statisticsPage', {
        headers: {
          Authorization: accessToken
        }
      })
      .then((response) => {
        console.log(response.data);
        // Handle the response and update the state if needed
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

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
          <Bar dataKey="date" fill="#8884d8" />
          <Bar dataKey="waterAmount" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsPage;
