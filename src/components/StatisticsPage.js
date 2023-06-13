/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Extend Date object to get the week number

// eslint-disable-next-line no-extend-native, func-names
Date.prototype.getWeek = function () {
  const date = new Date(this);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));

  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);

  return weekNumber;
};

const FilterData = (weekNumber, data) => {
  const filteredData = [];

  for (let i = 0; i < data.length; i++) {
    const elementDate = new Date(data[i].date);
    const elementWeek = elementDate.getWeek();

    if (elementWeek === weekNumber) {
      filteredData.push(data[i])
    }
  }

  return filteredData
}

const AverageData = (data) => {
  const average = {
    acne: 0,
    alcohol: 0,
    dairy: 0,
    exercised: 0,
    period: 0,
    sleepHours: 0,
    stress: 0,
    sugar: 0,
    waterAmount: 0,
    greasyFood: 0
  };

  const lengthData = data.length;

  for (let i = 0; i < lengthData; i++) {
    const element = data[i];
    average.acne += element.acne / lengthData
    average.alcohol += element.alcohol / lengthData
    average.dairy += element.dairy / lengthData
    average.exercised += element.exercised / lengthData
    average.period += element.period / lengthData
    average.sleepHours += element.sleepHours / lengthData
    average.stress += element.stress / lengthData
    average.sugar += element.sugar / lengthData
    average.waterAmount += element.waterAmount / lengthData
    average.greasyFood += element.greasyFood / lengthData
  }

  const dataChartOne = [
    {
      name: 'fastfood',
      value: average.greasyFood
    },
    {
      name: 'dairy',
      value: average.dairy
    },
    {
      name: 'alcohol',
      value: average.alcohol
    },
    {
      name: 'sugar',
      value: average.sugar
    },
    {
      name: 'acne',
      value: average.acne
    }

  ]
  const dataChartTwo = [
    {
      name: 'water',
      value: average.waterAmount
    },
    {
      name: 'excercise',
      value: average.exercised
    },
    {
      name: 'sleep',
      value: average.sleepHours
    },
    {
      name: 'stress',
      value: average.stress
    },
    {
      name: 'acne',
      value: average.acne
    }
  ]

  return [dataChartOne, dataChartTwo]
}

const GetFinalData = (data, index) => {
  console.log('data for barchart:', data);
  const filteredData = FilterData(24, data)
  console.log('filtered data', filteredData)
  const averageData = AverageData(filteredData)
  console.log('averaged data', averageData)

  return averageData[index]
}

const StatisticsPage = () => {
  const [data, setData] = useState([]);

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

  return (
    <div>
      {data.length > 0 ? (
        <>
          <h1>Chart 1</h1>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={GetFinalData(data, 0)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h1>Chart 2</h1>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={GetFinalData(data, 1)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default StatisticsPage;