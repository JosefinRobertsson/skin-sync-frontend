import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const accessToken = localStorage.getItem('accessToken');

    axios.post('http://localhost:8080/logout', {
      accessToken
    })
      .then((response) => {
        console.log(response);
        // Clear the access token from localStorage
        localStorage.removeItem('accessToken');
        navigate('/logout'); // Take user to logout screen
      })
      .catch((error) => console.error(error));
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/userpage">Home</Link>
        </li>
        <li>
          <Link to="/DailyReport">Log details</Link>
        </li>
        <li>
          <Link to="/skincareProduct">Product shelf</Link>
        </li>
        <li>
          <Link to="/statisticsPage">Statistics</Link>
        </li>
        <li>
          <button type="button" onClick={handleLogout}>Log out</button>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
