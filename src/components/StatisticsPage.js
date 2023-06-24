/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './StatisticsPage.css'

const CustomYAxisTick = ({ x, y, payload }) => {
  const value = payload.value === 100 ? '100%' : `${payload.value}%`;
  return (
    <text x={x} y={y} textAnchor="end" fill="white">
      {value}
    </text>
  );
};

const StatisticsPage = ({ reportData, setReportData }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }
        const config = {
          headers: {
            Authorization: accessToken
          }
        };
        // const reportResponse = await axios.get('http://localhost:8080/dailyReport', config);
        const reportResponse = await axios.get('https://skinsync-mgydyyeela-no.a.run.app/dailyReport', config);
        console.log('fullDailyReport:', reportResponse.data);
        if (reportResponse.data.success) {
          setReportData(reportResponse.data.response);
        } else {
          throw new Error('Failed to fetch daily report');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latestDailyReport = reportData[reportData.length - 1] || {};
  console.log('latestDailyReport:', latestDailyReport);

  const requiredKeys = ['greasyFood', 'dairy', 'alcohol', 'sugar', 'acne', 'water', 'exercised', 'sleep', 'stress'];
  const isDataAvailable = requiredKeys.every(
    (key) => key in latestDailyReport || latestDailyReport[key] === 0
    || latestDailyReport[key] === undefined
  );

  if (!isDataAvailable) {
    // Render a loading state or return early
    return <div>Loading...</div>;
  }

  const dataChartOne = [
    {
      name: 'fastfood',
      value: latestDailyReport.greasyFood
    },
    {
      name: 'dairy',
      value: latestDailyReport.dairy
    },
    {
      name: 'alcohol',
      value: latestDailyReport.alcohol
    },
    {
      name: 'sugar',
      value: latestDailyReport.sugar
    },
    {
      name: 'skin issues',
      value: latestDailyReport.acne
    }
  ];

  const dataChartTwo = [
    {
      name: 'water',
      value: latestDailyReport.waterAmount
    },
    {
      name: 'excercise',
      value: latestDailyReport.exercised
    },
    {
      name: 'sleep',
      value: latestDailyReport.sleepHours
    },
    {
      name: 'stress',
      value: latestDailyReport.stress
    },
    {
      name: 'skin issues',
      value: latestDailyReport.acne
    }
  ];

  return (
    <div className="statisticsbody">
      <div className="svgs">
        <svg>
          <defs>
            <linearGradient id="barGradientDiet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D57816" />
              <stop offset="60%" stopColor="#A516D5" />
              <stop offset="100%" stopColor="#722ED1" />
            </linearGradient>
          </defs>
        </svg>
        <svg>
          <defs>
            <linearGradient id="barGradientHabits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D57816" />
              <stop offset="60%" stopColor="#A516D5" />
              <stop offset="100%" stopColor="#eee" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {reportData.length > 0 ? (
        <div>
          <h1>Your log today</h1>
          <h2>Diet</h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              barSize={38}
              width={500}
              height={300}
              data={dataChartOne}
              margin={{
                top: 5,
                right: 35,
                left: 5,
                bottom: 5
              }}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis
                dataKey="name"
                angle={45}
                dx={15}
                dy={20}
                interval={0}
                minTickGap={-200}
                tickMargin={5}
                height={70}
                tick={{ fill: 'white' }} />
              <YAxis
                tick={<CustomYAxisTick />}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                name="value"
                legendType="none">
                {
                  dataChartOne.map((entry) => {
                    const isSkinIssues = entry.name === 'skin issues';
                    const barColor = isSkinIssues ? 'salmon' : 'url(#barGradientDiet)';
                    const uniqueKey = uuid();

                    return (
                      <Cell
                        key={uniqueKey}
                        fill={barColor}
                        fillOpacity={1}
                        stroke={isSkinIssues ? 'salmon' : '#A556D5'}
                        strokeWidth={1} />
                    );
                  })
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <h2>Habits</h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              barSize={38}
              width={500}
              height={300}
              data={dataChartTwo}
              margin={{
                top: 5,
                right: 35,
                left: 5,
                bottom: 5
              }}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis
                dataKey="name"
                angle={45}
                dx={15}
                dy={20}
                interval={0}
                minTickGap={-200}
                tickMargin={5}
                height={70}
                tick={{ fill: 'white' }} />
              <YAxis
                tick={<CustomYAxisTick />}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                name="value"
                legendType="none">
                {
                  dataChartTwo.map((entry) => {
                    const isSkinIssues = entry.name === 'skin issues';
                    const barColor = isSkinIssues ? 'salmon' : 'url(#barGradientHabits)';
                    const uniqueKey = uuid();

                    return (
                      <Cell
                        key={uniqueKey}
                        fill={barColor}
                        fillOpacity={1}
                        stroke={isSkinIssues ? 'salmon' : '#A556D5'}
                        strokeWidth={1} />
                    );
                  })
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default StatisticsPage;