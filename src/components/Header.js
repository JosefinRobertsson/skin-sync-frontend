import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Spin as Hamburger } from 'hamburger-react';
import './compCSS/Header.css';

const Header = ({ username }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1210);

  const handleLogout = () => {
    const accessToken = localStorage.getItem('accessToken');

    axios.post('/logout', {
      accessToken
    })
      .then((response) => {
        console.log(response);
        // Clear the access token from localStorage
        localStorage.removeItem('accessToken');
        navigate('/');
      })
      .catch((error) => console.error(error));
  };

  const toggleMenu = () => {
    if (window.innerWidth < 1210) { setIsOpen(!isOpen); }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 1210);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const hideHeader = location.pathname !== '/login'
    && location.pathname !== '/'
    && location.pathname !== '/register'
    && location.pathname !== '/logout';

  return (
    <nav style={{ display: hideHeader ? 'block' : 'none' }}>
      <button type="button" className="menu-icon" onClick={toggleMenu}>
        <Hamburger
          hideOutline={false}
          toggled={isOpen}
          rounded
          toggle={setIsOpen}
          size={25}
          label="Show menu" />
      </button>

      <ul className="menu-items" style={{ display: isOpen ? 'block' : 'none' }}>
        <li>
          <Link to={`/userpage?username=${username}`} onClick={toggleMenu} style={{ textDecoration: 'none' }} className="link-styling">
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
