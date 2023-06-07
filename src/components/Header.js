import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Spin as Hamburger } from 'hamburger-react'

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    // <nav className={`navbar ${isOpen ? 'open' : ''}`}>
    <nav>
      <button type="button" className="menu-icon" onClick={toggleMenu}>
        <Hamburger toggled={isOpen} toggle={setIsOpen} label="Show menu" color="#e3e33f" />
      </button>
      <ul
        className="menu-items"
        style={{ display: isOpen ? 'block' : 'none' }}>
        <li>
          <Link to="/userpage" onClick={toggleMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/DailyReport" onClick={toggleMenu}>
            Log details
          </Link>
        </li>
        <li>
          <Link to="/productShelf" onClick={toggleMenu}>
            Product shelf
          </Link>
        </li>
        <li>
          <Link to="/statisticsPage" onClick={toggleMenu}>
            Statistics
          </Link>
        </li>
        <li>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
