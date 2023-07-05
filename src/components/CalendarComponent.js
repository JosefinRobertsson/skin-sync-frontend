import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './compCSS/CalendarComponent.css';
import styled from 'styled-components';

const Styledh1 = styled.h1`
  font-size: 32px;
  letter-spacing: 0.5%;
  text-align: center;
  color: rgba(255, 244, 233, 0.85);
`;

const CalendarComponent = ({ chosenDate, setChosenDate }) => {
  const handleDateChange = (date) => {
    setChosenDate(date);
  };

  return (

    <div className="calendar-wrapper">
      <Styledh1>Weekly stats</Styledh1>
      <div className="calendar-container">
        <Calendar onChange={handleDateChange} value={chosenDate} />
        <div className="stats-description">
          <p>Click a date to see the average of the statistics you logged that week, and
        all the products you used each day.
        Click a product to see the total number of times you used it.
        You can also see what data you logged today.
          </p>
        </div>
      </div>
    </div>

  )
}

export default CalendarComponent;
