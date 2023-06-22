import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Spin as Hamburger } from 'hamburger-react';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    const accessToken = localStorage.getItem('accessToken');

    axios.post(' https://skinsync-mgydyyeela-no.a.run.app/logout', {
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
      {(location.pathname !== '/login' && location.pathname !== '/LandingLogo' && location.pathname !== '/') && (
        <button type="button" className="menu-icon" onClick={toggleMenu}>
          <Hamburger
            hideOutline={false}
            toggled={isOpen}
            rounded
            toggle={setIsOpen}
            size={25}
            label="Show menu" />
        </button>
      )}

      <ul
        className="menu-items"
        style={{ display: isOpen ? 'block' : 'none' }}>
        <li>
          <Link to="/userpage" onClick={toggleMenu} style={{ textDecoration: 'none' }} className="link-styling">
            Home
          </Link>
        </li>
        <li>
          <Link to="/DailyReport" onClick={toggleMenu} style={{ textDecoration: 'none' }} className="link-styling">
            Log day
          </Link>
        </li>
        <li>
          <Link to="/productShelf/logUsage" onClick={toggleMenu} style={{ textDecoration: 'none' }} className="link-styling">
            Log skincare
          </Link>
        </li>
        <li>
          <Link to="/productShelf" onClick={toggleMenu} style={{ textDecoration: 'none' }} className="link-styling">
            Product shelf
          </Link>
        </li>
        <li>
          <Link to="/statisticsPage" onClick={toggleMenu} style={{ textDecoration: 'none' }} className="link-styling">
            Statistics
          </Link>
        </li>
        <li>
          <Link to="/" onClick={handleLogout} style={{ textDecoration: 'none' }} className="link-styling">
            Log out
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
