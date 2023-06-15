import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ onDateChoice }) => {
  const [chosenDate, setChosenDate] = useState(new Date());

  const handleDateChange = (date) => {
    setChosenDate(date);
    onDateChoice(date);
    console.log('chosenDate:', chosenDate);
  };

  return (
    <Calendar onChange={handleDateChange} value={chosenDate} />
  )
}

export default CalendarComponent;