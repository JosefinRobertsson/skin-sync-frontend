/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */

import React, { useState } from 'react';
import './DailyReport.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { RegisterButton } from '../styles/StyledButtons';

const DailyReport = () => {
  const [exercised, setExercised] = useState(false);
  const [period, setPeriod] = useState(false);
  const [mood, setMood] = useState('');
  const [skinCondition, setSkinCondition] = useState([]);
  const [diet, setDiet] = useState([]);
  const [waterAmount, setWaterAmount] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      body: JSON.stringify({
        exercised,
        period,
        mood,
        skinCondition,
        diet,
        waterAmount,
        sleepHours
      })
    };

    fetch('http://localhost:8080/dailyReport', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Daily report submitted successfully');
          setExercised(false);
          setPeriod(false);
          setMood('');
          setSkinCondition([]);
          setDiet([]);
          setSleepHours(0);
          setWaterAmount(0);
        } else {
          console.error('Failed to submit daily report');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  return (
    <div>
      <h1>Daily Report</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="waterRange"> Water Intake: {waterAmount} glasses of water </label>
          <input
            type="range"
            id="waterRange"
            min="0"
            max="20"
            value={waterAmount}
            onChange={(event) => setWaterAmount(event.target.value)} />
        </div>

        <div>
          <label htmlFor="sleepRange">Sleep Hours: {sleepHours} hours</label>
          <input
            type="range"
            id="sleepRange"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(event) => setSleepHours(event.target.value)} />

        </div>
        <div>
          <label htmlFor="exercised">Did you Exercise today?:</label>
          <Toggle
            id="exercised"
            checked={exercised}
            onChange={(e) => setExercised(e.target.checked)} />
        </div>
        <div>
          <label htmlFor="period">Do you have your period today?</label>
          <Toggle
            id="period"
            checked={period}
            onChange={(e) => setPeriod(e.target.checked)} />
        </div>
        <div>
          <label htmlFor="mood">How was your mood today?</label>
          <div>
            <button
              type="button"
              className={`mood-button ${mood === 'Not stressful' ? 'selected' : ''}`}
              onClick={() => setMood('Not stressful')}>
              <img src="/path/to/not-stressful-emoji.png" alt="Not stressful" />
            </button>
            <button
              type="button"
              className={`mood-button ${mood === 'Under control' ? 'selected' : ''}`}
              onClick={() => setMood('Under control')}>
              <img src="/path/to/under-control-emoji.png" alt="Under control" />
            </button>
            <button
              type="button"
              className={`mood-button ${mood === 'Stressful' ? 'selected' : ''}`}
              onClick={() => setMood('Stressful')}>
              <img src="/path/to/stressful-emoji.png" alt="Stressful" />
            </button>
            <button
              type="button"
              className={`mood-button ${mood === 'Extremely stressful' ? 'selected' : ''}`}
              onClick={() => setMood('Extremely stressful')}>
              <img src="/path/to/extremely-stressful-emoji.png" alt="Extremely stressful" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="skinCondition">How is your skin feeling today?</label>
          <select
            id="skinCondition"
            value={skinCondition}
            onChange={(e) => setSkinCondition(Array.from(
              e.target.selectedOptions,
              (option) => option.value
            ))}
            multiple>
            <option value="Normal">Normal</option>
            <option value="Irritated">Irritated</option>
            <option value="Dry">Dry</option>
            <option value="Oily">Oily</option>
            <option value="Dull">Dull</option>
            <option value="Itchy">Itchy</option>
            <option value="With texture">With texture</option>
            <option value="Acne">Acne</option>
          </select>
        </div>
        <div>
          <label htmlFor="diet">What did you eat today?</label>
          <select
            id="diet"
            value={diet}
            onChange={(e) => setDiet(Array.from(
              e.target.selectedOptions,
              (option) => option.value
            ))}
            multiple>
            <option value="Sugar">Sugar</option>
            <option value="Fast food">Fast food</option>
            <option value="Alcohol">Alcohol</option>
            <option value="Dairy">Dairy</option>
            <option value="Veggies">Veggies</option>
            <option value="Fruits">Fruits</option>
            <option value="Meat">Meat</option>
            <option value="Grains">Grains</option>
          </select>
        </div>
        <RegisterButton className="RegisterButton" type="submit">Submit</RegisterButton>
      </form>
    </div>
  );
}

export default DailyReport;
