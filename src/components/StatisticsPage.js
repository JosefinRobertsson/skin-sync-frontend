import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/dailyReport', {
          headers: {
            Authorization: 'Bearer 98d0642d44becd205dc3ea5fd388c55cd77666c5c58366bdf99a8dee647da972385915bb1a744c87fb6352e02820e7dadaabe29f5941e35ca8d80dc9af79d9b801707a744deb1b5005c2819d92148e79beef0eb037caff838bfac462bb86e108360c3dc8f63dc3da317058c5546b8c399d363bfa3fea656fae3ad7d04fcbe951'

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
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
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
  }, []);

  return (
    <div>
      <h1>Chart</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 10, left: 20, right: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
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
