/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DailyReport.css';
import { Slide } from 'react-awesome-reveal';
import { RegisterButton } from '../styles/StyledButtons';
import 'react-toggle/style.css'

const DailyReport = () => {
  const [exercised, setExercised] = useState(0);
  const [period, setPeriod] = useState(false);
  const [stress, setStress] = useState(0);
  const [acne, setAcne] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [dairy, setDairy] = useState(0);
  const [alcohol, setAlcohol] = useState(0);
  const [greasyFood, setGreasyFood] = useState(0);
  const [waterAmount, setWaterAmount] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);

  const navigate = useNavigate();
  const getLabel = (value) => {
    // eslint-disable-next-line eqeqeq
    if (value == 0) return 'None';
    if (value > 0 && value <= 25) return 'Low';
    if (value >= 26 && value <= 55) return 'Average';
    if (value >= 56 && value <= 75) return 'Generous';
    if (value >= 76 && value <= 100) return 'High';
    return '';
  };

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
        waterAmount,
        sleepHours,
        stress,
        acne,
        greasyFood,
        dairy,
        alcohol,
        sugar,
        period

      })
    };
    fetch('http://localhost:8080/dailyReport', options)
    // fetch('https://skinsync-mgydyyeela-no.a.run.app/dailyReport', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Daily report submitted successfully');
          setExercised(0);
          setPeriod(false);
          setStress(0);
          setAcne(0);
          setSugar(0);
          setDairy(0);
          setAlcohol(0);
          setGreasyFood(0);
          setSleepHours(0);
          setWaterAmount(0);
        } else {
          console.error('Failed to submit daily report');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        navigate('/productShelf/logUsage');
      });
  };

  return (
    <div className="dailyreportbody">
      <Slide>
        <h1>Log your Day</h1>
      </Slide>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="waterRange">Water:</label>
          <div className="range-container">
            <input
              type="range"
              id="waterRange"
              min={0}
              max={100}
              step={1}
              value={waterAmount}
              onChange={(event) => {
                console.log('water slider value:', event.target.value);
                setWaterAmount(event.target.value);
              }} />
            <span>{getLabel(waterAmount)}</span>

          </div>
        </div>

        <div>
          <label htmlFor="sleepRange">Sleep:</label>
          <input
            type="range"
            id="sleepRange"
            min={0}
            max={100}
            step={1}
            value={sleepHours}
            onChange={(event) => {
              console.log('sleep slider value:', event.target.value);
              setSleepHours(event.target.value)
            }} />
          <span>{getLabel(sleepHours, 'sleepRange')}</span>
        </div>

        <div>
          <label htmlFor="stress">Stress:</label>
          <input
            type="range"
            id="stressRange"
            min={0}
            max={100}
            step={1}
            value={stress}
            onChange={(event) => {
              console.log('stress slider value:', event.target.value);
              setStress(event.target.value)
            }} />
          <span>{getLabel(stress, 'stressRange')}</span>
        </div>

        <div>
          <label htmlFor="acne">Skin issues:</label>
          <input
            type="range"
            id="acneRange"
            min={0}
            max={100}
            step={1}
            value={acne}
            onChange={(event) => {
              console.log('acne slider value:', event.target.value);
              setAcne(event.target.value)
            }} />
          <span>{getLabel(acne, 'acneRange')}</span>
        </div>

        <div>
          <label htmlFor="exercised">Exercise:</label>
          <input
            type="range"
            id="exercisedRange"
            min={0}
            max={100}
            step={1}
            value={exercised}
            onChange={(event) => {
              console.log('exercise slider value:', event.target.value);
              setExercised(event.target.value)
            }} />
          <span>{getLabel(exercised, 'exercisedRange')}</span>
        </div>

        <div>
          <label htmlFor="sugar">Sugar:</label>
          <input
            type="range"
            id="sugarRange"
            min={0}
            max={100}
            step={1}
            value={sugar}
            onChange={(event) => {
              console.log('sugar slider value:', event.target.value);
              setSugar(event.target.value)
            }} />
          <span>{getLabel(sugar, 'sugarRange')}</span>
        </div>
        <div>
          <label htmlFor="alcohol">Alcohol:</label>
          <input
            type="range"
            id="alcoholRange"
            min={0}
            max={100}
            step={1}
            value={alcohol}
            onChange={(event) => {
              console.log('alcohol slider value:', event.target.value);
              setAlcohol(event.target.value)
            }} />
          <span>{getLabel(alcohol, 'alcoholRange')}</span>
        </div>

        <div>
          <label htmlFor="dairy">Dairy:</label>
          <input
            type="range"
            id="dairyRange"
            min={0}
            max={100}
            step={1}
            value={dairy}
            onChange={(event) => {
              console.log('dairy slider value:', event.target.value);
              setDairy(event.target.value)
            }} />
          <span>{getLabel(dairy, 'dairyRange')}</span>

        </div>
        <div>
          <label htmlFor="greasyFood">Fastfood:</label>
          <input
            type="range"
            id="greasyFoodRange"
            min={0}
            max={100}
            step={1}
            value={greasyFood}
            onChange={(event) => {
              console.log('fastfood slider value:', event.target.value);
              setGreasyFood(event.target.value)
            }} />
          <span>{getLabel(greasyFood, 'greasyFoodRange')}</span>
        </div>

        <RegisterButton className="RegisterButton" type="submit">Save day</RegisterButton>
      </form>
    </div>
  );
}

export default DailyReport;

// STRECH GOALS

{ /*

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
          <div id="diet">
            <button
              type="button"
              className={`diet-button ${diet.includes('Sugar') ? 'selected' : ''}`}
              onClick={() => setDiet('Sugar')}>
              <img src="/path/to/sugar-image.png" alt="Sugar" />
            Sugar
            </button>
            <button
              type="button"
              className={`diet-button ${diet.includes('Fast food') ? 'selected' : ''}`}
              onClick={() => setDiet('Fast food')}>
              <img src="/path/to/fast-food-image.png" alt="Fast food" />
            Fast food
            </button>
            <button
              type="button"
              className={`diet-button ${diet.includes('Alcohol') ? 'selected' : ''}`}
              onClick={() => setDiet('Alcohol')}>
              <img src="/path/to/alcohol-image.png" alt="Alcohol" />
            Alcohol
            </button>
            <button
              type="button"
              className={`diet-button ${diet.includes('Dairy') ? 'selected' : ''}`}
              onClick={() => setDiet('Dairy')}>
              <img src="/path/to/dairy-image.png" alt="Dairy" />
            Dairy
            </button>
            <button
              type="button"
              className={`diet-button ${diet.includes('Veggies') ? 'selected' : ''}`}
              onClick={() => setDiet('Veggies')}>
              <img src="/path/to/veggies-image.png" alt="Veggies" />
            Veggies
            </button>
            <button
              type="button"
              className={`diet-button ${diet.includes('Fruits') ? 'selected' : ''}`}
              onClick={() => setDiet('Fruits')}>
              <img src="/path/to/fruits-image.png" alt="Fruits" />
            Fruits
            </button>
            <button
              type="button"
              className={`diet-button ${diet.includes('Grains') ? 'selected' : ''}`}
              onClick={() => setDiet('Grains')}>
              <img src="/path/to/grains-image.png" alt="Grains" />
            Grains
            </button>
          </div>
        </div>
*/ }
