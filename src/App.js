import React from 'react';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DailyReport from './components/DailyReport';
import SkincareProduct from './components/SkincareProduct';

export function App() {
  return (
    <BrowserRouter>
      <h1>Skin sync</h1>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/DailyReport" element={<DailyReport />} />
        <Route path="/skincareProduct" element={<SkincareProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
