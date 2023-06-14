import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Spin as Hamburger } from 'hamburger-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <nav>
      {/* prevent the hamburger menu to show in the loginpage */}
      {(location.pathname !== '/login' && location.pathname !== '/LandingLogo') && (
        <button type="button" className="menu-icon" onClick={toggleMenu}>
          <Hamburger toggled={isOpen} toggle={setIsOpen} label="Show menu" />
        </button>
      )}

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
