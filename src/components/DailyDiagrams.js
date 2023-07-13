/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './compCSS/DailyDiagrams.css'
import DietIcon from '../images/food.png';
import HabitsIcon from '../images/bicycle.png';

const CustomYAxisTick = ({ x, y, payload }) => {
  const value = payload.value === 100 ? '100%' : `${payload.value}%`;
  return (
    <text x={x} y={y} textAnchor="end" fill="white">
      {value}
    </text>
  );
};

const DailyDiagrams = ({ reportData, setReportData }) => {
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
        const reportResponse = await axios.get('/dailyReport', config);
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
    <div className="daily-bars-wrapper">
      <div className="svgs">
        <svg>
          <defs>
            <linearGradient id="barGradientDiet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#fbcc12" />
              <stop offset="50%" stopColor="#ea9350" />
              <stop offset="90%" stopColor="#60207e" />
            </linearGradient>
          </defs>
        </svg>
        <svg>
          <defs>
            <linearGradient id="barGradientHabits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#faff67" />
              <stop offset="60%" stopColor="#ea9350" />
              <stop offset="90%" stopColor="#31be2c" />
            </linearGradient>
          </defs>
        </svg>
        <svg>
          <defs>
            <linearGradient id="skinIssuesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#fbf9f3" />
              <stop offset="50%" stopColor="#868583" />
              <stop offset="90%" stopColor="#010b00" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {reportData.length > 0 ? (
        <div>
          <h1>Your latest log</h1>
          <div className="daily-bars-container">
            <div className="diagram-wrapper">
              <div className="diagram-header">
                <h2>Diet today</h2>
                <img src={DietIcon} alt="diet symbol fruit" className="diet-img" />
              </div>
              <ResponsiveContainer height={340} className="diet-bars">
                <BarChart
                  barSize={28}
                  width={500}
                  height={300}
                  data={dataChartOne}
                  margin={{
                    top: 15,
                    right: 35,
                    left: -5,
                    bottom: 20
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
                        const barColor = isSkinIssues ? 'url(#skinIssuesGradient)' : 'url(#barGradientDiet)';
                        const uniqueKey = uuid();

                        return (
                          <Cell
                            key={uniqueKey}
                            fill={barColor}
                            fillOpacity={1}
                            stroke={isSkinIssues ? 'url(#skinIssuesGradient)' : '#A556D5'}
                            strokeWidth={1} />
                        );
                      })
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="diagram-wrapper">
              <div className="diagram-header">
                <h2>Habits today</h2>
                <img src={HabitsIcon} alt="habits symbol bicycle" />
              </div>
              <ResponsiveContainer height={340} className="habits-bars">
                <BarChart
                  barSize={28}
                  width={500}
                  height={300}
                  data={dataChartTwo}
                  margin={{
                    top: 15,
                    right: 35,
                    left: -5,
                    bottom: 20
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
                        const barColor = isSkinIssues ? 'url(#skinIssuesGradient)' : 'url(#barGradientHabits)';
                        const uniqueKey = uuid();

                        return (
                          <Cell
                            key={uniqueKey}
                            fill={barColor}
                            fillOpacity={1}
                            stroke={isSkinIssues ? 'url(#skinIssuesGradient)' : '#A556D5'}
                            strokeWidth={1} />
                        );
                      })
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <hr className="diagram-separator" />
    </div>
  );
};

export default DailyDiagrams;