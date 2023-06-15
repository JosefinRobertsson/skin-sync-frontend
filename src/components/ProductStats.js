import React from 'react';
import CalendarComponent from './CalendarComponent';
import ProductStatistics from './ProductStatistics';

const ProductStats = ({ handleDateChoice, chosenDate }) => {
  return (
    <>
      <CalendarComponent onDateChoice={handleDateChoice} />
      <ProductStatistics chosenDate={chosenDate} />
    </>
  )
}

export default ProductStats;