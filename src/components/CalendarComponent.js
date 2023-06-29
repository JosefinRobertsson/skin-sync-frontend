import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './compCSS/CalendarComponent.css';
import styled from 'styled-components';

const StyledDiv = styled.div`
  background-color:#1f101f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 90vh;
`;
const Styledh2 = styled.h2`
  padding-bottom: 20%;
  font-size: 32px;
  letter-spacing: 0.5%;
  text-align: center;
  color: rgba(255, 244, 233, 0.85);
`;

const Styledp = styled.p`
color: #FFF5E9;
padding-left: 1rem;
padding-right: 1rem;
padding-top: 0.6rem;
font-family: 'Athiti', sans-serif;
`;

const CalendarComponent = ({ chosenDate, setChosenDate }) => {
  const handleDateChange = (date) => {
    setChosenDate(date);
  };

  return (
    <StyledDiv>
      <Styledh2>Weekly stats</Styledh2>
      <Calendar onChange={handleDateChange} value={chosenDate} />
      <Styledp>Choose a date to see your average statistics and
        the products you used that week
      </Styledp>
    </StyledDiv>
  )
}

export default CalendarComponent;

