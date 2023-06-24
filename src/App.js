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
import WeeklyDiagrams from './components/WeeklyDiagrams';
import ProductStatistics from './components/ProductStatistics';

export const App = () => {
  const [chosenDate, setChosenDate] = useState(new Date());
  const [username, setUsername] = useState('');
  const [reportData, setReportData] = useState([]);

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

  return (
    <div className="allWrapper">
      <BrowserRouter>
        <>
          <Header username={username} />
          <Routes>
            <Route path="/" element={<LandingLogo />} />
            <Route path="/Login" element={<Login username={username} setUsername={setUsername} />} />
            <Route path="/userpage" element={<UserPage username={username} />} />
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
                  <StatisticsPage reportData={reportData} setReportData={setReportData} />
                  <CalendarComponent chosenDate={chosenDate} setChosenDate={setChosenDate} />
                  <WeeklyDiagrams chosenDate={chosenDate} reportData={reportData} />
                  <ProductStatistics chosenDate={chosenDate} />
                </>
              } />
            <Route path="/logout" element={<Logout />} />

          </Routes>
        </>
      </BrowserRouter>
    </div>
  );
}

export default App;
