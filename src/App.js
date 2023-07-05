import React, { useState, useEffect } from 'react';
import {
  BrowserRouter, Routes, Route, useLocation
} from 'react-router-dom';
import DailyReport from './components/DailyReport';
import MorningShelf from './components/MorningShelf';
import UserPage from './components/UserPage';
import Logout from './components/Logout';
import Header from './components/Header';
import UsageTracker from './components/UsageTracker';
import NightShelf from './components/NightShelf';
import LandingPage from './components/LandingPage';
import CalendarComponent from './components/CalendarComponent';
import WeeklyDiagrams from './components/WeeklyDiagrams';
import ProductStatistics from './components/ProductStatistics';
import DailyDiagrams from './components/DailyDiagrams';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

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
        <ScrollToTop />
        <>
          <Header username={username} />
          <Routes>
            <Route path="/" element={<LandingPage username={username} setUsername={setUsername} />} />
            <Route path="/userpage" element={<UserPage username={username} />} />

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
                  <CalendarComponent chosenDate={chosenDate} setChosenDate={setChosenDate} />
                  <DailyDiagrams
                    reportData={reportData}
                    setReportData={setReportData}
                    chosenDate={chosenDate} />
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
