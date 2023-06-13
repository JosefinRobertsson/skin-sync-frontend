import React from 'react';
import './LandingLogo.css';
import LandingLogoimg from '../images/LandingLogoimg.png'; // Update the path to your image

const LandingLogo = () => {
  return (
    <div className="logo-page">
      <img src={LandingLogoimg} alt="logo" className="background-image" />
    </div>
  );
}

export default LandingLogo;
