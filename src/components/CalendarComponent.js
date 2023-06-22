import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

const StyledDiv = styled.div`
  background-color:#1f101f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
`;
const StyledH1 = styled.h1`
  padding-bottom: 10%;
  font-size: 32px;
  letter-spacing: 0.5%;
  text-align: center;
  color: #FFF5E9;
`;

const Styledp = styled.p`
color: #FFF5E9;
padding-left: 1rem;
padding-right: 1rem;
`;

const CalendarComponent = ({ chosenDate, setChosenDate }) => {
  const handleDateChange = (date) => {
    setChosenDate(date);
  };

  return (
    <StyledDiv>
      <StyledH1>Products</StyledH1>
      <Styledp>Choose a date to see the products you used that week</Styledp>
      <Calendar onChange={handleDateChange} value={chosenDate} />
    </StyledDiv>
  )
}

export default CalendarComponent;

