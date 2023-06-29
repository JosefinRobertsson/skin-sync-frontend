import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import './compCSS/WeeklyDiagrams.css';
import './compCSS/StatisticsPage.css'

const CustomYAxisTick = ({ x, y, payload }) => {
  const value = payload.value === 100 ? '100%' : `${payload.value}%`;
  return (
    <text x={x} y={y} textAnchor="end" fill="white">
      {value}
    </text>
  );
};

const WeeklyDiagrams = ({ chosenDate, reportData }) => {
  const [dietData, setDietData] = useState([]);
  const [habitsData, setHabitsData] = useState([]);

  const chosenWeek = moment(chosenDate).isoWeek();

  useEffect(() => {
    const calculateAverage = () => {
      const thisWeekReports = reportData.filter((report) => {
        const weekNumber = moment(report.date).isoWeek();
        return weekNumber === chosenWeek;
      });

      const average = {
        acne: 0,
        alcohol: 0,
        dairy: 0,
        exercised: 0,
        sleepHours: 0,
        stress: 0,
        sugar: 0,
        waterAmount: 0,
        greasyFood: 0
      };

      const lengthData = thisWeekReports.length;

      thisWeekReports.forEach((report) => {
        average.acne += report.acne / lengthData;
        average.alcohol += report.alcohol / lengthData;
        average.dairy += report.dairy / lengthData;
        average.exercised += report.exercised / lengthData;
        average.sleepHours += report.sleepHours / lengthData;
        average.stress += report.stress / lengthData;
        average.sugar += report.sugar / lengthData;
        average.waterAmount += report.waterAmount / lengthData;
        average.greasyFood += report.greasyFood / lengthData;
      });

      const dietAverage = {
        greasyFood: average.greasyFood,
        dairy: average.dairy,
        alcohol: average.alcohol,
        sugar: average.sugar,
        acne: average.acne
      };

      const habitsAverage = {
        exercised: average.exercised,
        sleepHours: average.sleepHours,
        stress: average.stress,
        waterAmount: average.waterAmount,
        acne: average.acne
      };

      const weeklyDietArray = [
        {
          name: 'fastfood',
          value: dietAverage.greasyFood
        },
        {
          name: 'dairy',
          value: dietAverage.dairy
        },
        {
          name: 'alcohol',
          value: dietAverage.alcohol
        },
        {
          name: 'sugar',
          value: dietAverage.sugar
        },
        {
          name: 'skin issues',
          value: dietAverage.acne
        }
      ];

      const weeklyHabitsArray = [
        {
          name: 'exercise',
          value: habitsAverage.exercised
        },
        {
          name: 'sleep',
          value: habitsAverage.sleepHours
        },
        {
          name: 'stress',
          value: habitsAverage.stress
        },
        {
          name: 'water',
          value: habitsAverage.waterAmount
        },
        {
          name: 'skin issues',
          value: habitsAverage.acne
        }
      ];

      setDietData(weeklyDietArray);
      setHabitsData(weeklyHabitsArray);
    };

    calculateAverage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData, chosenWeek]);

  return (
    <div className="statisticsbody weeklyBarsWrapper">
      <div className="svgs">
        <svg>
          <defs>
            <linearGradient id="barGradientDiet2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D57816" />
              <stop offset="60%" stopColor="#A516D5" />
              <stop offset="100%" stopColor="#722ED1" />
            </linearGradient>
          </defs>
        </svg>
        <svg>
          <defs>
            <linearGradient id="barGradientHabits2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D57816" />
              <stop offset="60%" stopColor="#A516D5" />
              <stop offset="100%" stopColor="#eee" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {reportData.length > 0 ? (
        <div>
          <h2>Diet week {chosenWeek}</h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              barSize={38}
              width={500}
              height={300}
              data={dietData}
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
                  dietData.map((entry) => {
                    const isSkinIssues = entry.name === 'skin issues';
                    const barColor = isSkinIssues ? 'salmon' : 'url(#barGradientDiet2)';
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

          <h2>Habits week {chosenWeek}</h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              barSize={38}
              width={500}
              height={300}
              data={habitsData}
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
                  habitsData.map((entry) => {
                    const isSkinIssues = entry.name === 'skin issues';
                    const barColor = isSkinIssues ? 'salmon' : 'url(#barGradientHabits2)';
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

export default WeeklyDiagrams;