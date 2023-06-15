import React, { useState, useEffect } from 'react';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DailyReport from './components/DailyReport';
import MorningShelf from './components/MorningShelf';
import UserPage from './components/UserPage';
import StatisticsPage from './components/StatisticsPage';
import Logout from './components/Logout';
import Header from './components/Header';
import UsageTracker from './components/UsageTracker';
import NightShelf from './components/NightShelf';
import LandingLogo from './components/LandingLogo';
import CalendarComponent from './components/CalendarComponent';
import ProductStatistics from './components/ProductStatistics';

export const App = () => {
  const [chosenDate, setChosenDate] = useState(new Date());

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        setChosenDate(new Date());
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const handleDateChoice = (date) => {
    setChosenDate(date);
    console.log('chosenDate:', chosenDate);
  }

  return (
    <BrowserRouter>
      <>
        <Header />

        <Routes>
          <Route path="/" element={<LandingLogo />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/DailyReport" element={<DailyReport />} />
          <Route
            path="/productShelf"
            element={
              <>
                <MorningShelf />
                <NightShelf />
              </>
            } />
          <Route
            path="/productShelf/logUsage"
            element={
              <UsageTracker />
            } />
          <Route
            path="/statisticsPage"
            element={
              <>
                <CalendarComponent onDateChoice={handleDateChoice} />
                <ProductStatistics chosenDate={chosenDate} />
                <StatisticsPage />
              </>
            } />
          <Route path="/logout" element={<Logout />} />

        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;

/*
  <Route path="/productStatistics"
  element={<ProductStats handleDateChoice={handleDateChoice} chosenDate={chosenDate} />} />
  */
