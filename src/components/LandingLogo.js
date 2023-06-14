import React from 'react';
import { useNavigate } from 'react-router-dom';

import './LandingLogo.css';
import LandingLogoimg from '../images/LandingLogoimg.png'; // Update the path to your image

const LandingLogo = () => {
  const navigate = useNavigate(); // Add the useNavigate hook

  return (
    <div>
      <div className="logo-page">
        <img src={LandingLogoimg} alt="logo" className="background-image" />
      </div>
      <button
        type="button"
        className="get-started-button"
        onClick={() => navigate('/login')}>
        GET STARTED
      </button>
    </div>
  );
}

export default LandingLogo;
