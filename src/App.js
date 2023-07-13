import React, { useState, useEffect } from 'react';
import {
  BrowserRouter, Routes, Route, useLocation
} from 'react-router-dom';
import axios from 'axios';
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
  const [morningProducts, setMorningProducts] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  axios.defaults.baseURL = 'https://skinsync-server.onrender.com'

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

  // Update morning shelf from Archive
  const getMorningProducts = () => {
    const accessToken = localStorage.getItem('accessToken');
    axios.get('/productShelf/morning', {
      headers: {
        Authorization: accessToken
      }
    })
      .then((response) => {
        const { data } = response;
        setMorningProducts(data.response);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  // Update Archive from other components
  const fetchSkincareProducts = async () => {
    console.log('fetching skincare products');
    setLoading(true);
    let morningResponse;
    let nightResponse;

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          Authorization: accessToken
        }
      };

      morningResponse = await axios.get('/productShelf/morning', config);
      nightResponse = await axios.get('/productShelf/night', config);
      if (!morningResponse.data.success || !nightResponse.data.success) {
        throw new Error('Failed to fetch skincare products');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    const mergedProducts = [...morningResponse.data.response, ...nightResponse.data.response];

    setArchivedProducts(mergedProducts);
    setLoading(false);
  };

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
                  <MorningShelf
                    morningProducts={morningProducts}
                    getMorningProducts={getMorningProducts}
                    fetchSkincareProducts={fetchSkincareProducts} />
                  <NightShelf
                    getMorningProducts={getMorningProducts}
                    archivedProducts={archivedProducts}
                    setArchivedProducts={setArchivedProducts}
                    fetchSkincareProducts={fetchSkincareProducts}
                    loading={loading} />
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
