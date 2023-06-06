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

export const App = () => {
  return (
    <BrowserRouter>
      <h1>Skin sync</h1>
      <Routes>
        <Route path="/" element={<OpenPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/DailyReport" element={<DailyReport />} />
        <Route path="/skincareProduct" element={<SkincareProduct />} />
        <Route path="/statisticsPage" element={<StatisticsPage />} />
        <Route path="/logout" element={<Logout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
