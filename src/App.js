import React from 'react';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DailyReport from './components/DailyReport';
import SkincareProduct from './components/SkincareProduct';
import UserPage from './components/UserPage';
import StatisticsPage from './components/StatisticsPage';
import OpenPage from './components/OpenPage';
import Logout from './components/Logout';
import Header from './components/Header';
import UsageTracker from './components/UsageTracker';

export const App = () => {
  return (
    <BrowserRouter>
      <>
        <Header />

        <Routes>
          <Route path="/" element={<OpenPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/DailyReport" element={<DailyReport />} />
          <Route path="/productShelf" element={<SkincareProduct />} />
          <Route path="/productShelf/logUsage" element={<UsageTracker />} />
          <Route path="/statisticsPage" element={<StatisticsPage />} />
          <Route path="/logout" element={<Logout />} />

        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
