/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */

import React, { useState } from 'react';

function DailyReport() {
  const [exercised, setExercised] = useState(false);
  const [period, setPeriod] = useState(false);
  const [mood, setMood] = useState('');
  const [skinCondition, setSkinCondition] = useState([]);
  const [diet, setDiet] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dailyReportData = {
      exercised,
      period,
      mood,
      skinCondition,
      diet,
    };

    try {
      const response = await fetch('http://localhost:8080/dailyReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dailyReportData),
      });

      if (response.ok) {
        // TODO: Handle successful submission
        console.log('Daily report submitted successfully');
      } else {
        // TODO: Handle submission error
        console.error('Failed to submit daily report');
      }
    } catch (error) {
      // TODO: Handle submission error
      console.error('Failed to submit daily report', error);
    }
  };

  return (
    <div>
      <h1>Daily Report</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="exercised">Exercised:</label>
          <input
            type="checkbox"
            id="exercised"
            checked={exercised}
            onChange={(e) => setExercised(e.target.checked)}
          />
        </div>
        <div>
          <label htmlFor="period">Do you have your period today?</label>
          <input
            type="checkbox"
            id="period"
            checked={period}
            onChange={(e) => setPeriod(e.target.checked)}
          />
        </div>
        <div>
          <label htmlFor="mood">How was your mood today?</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">Select mood</option>
            <option value="Not stressful">Not stressful</option>
            <option value="Under control">Under control</option>
            <option value="Stressful">Stressful</option>
            <option value="Extremely stressful">Extremely stressful</option>
          </select>
        </div>
        <div>
          <label htmlFor="skinCondition">How is your skin feeling today?</label>
          <select
            id="skinCondition"
            value={skinCondition}
            onChange={(e) => setSkinCondition(Array.from(
              e.target.selectedOptions,
              (option) => option.value,
            ))}
            multiple
          >
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
              (option) => option.value,
            ))}
            multiple
          >
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DailyReport;
