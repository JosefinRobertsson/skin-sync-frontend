import React from 'react';
import { Link } from 'react-router-dom';

const Logout = () => {
  return (
    <div>
      <h1>You have been logged out</h1>
      <p>Thank you for using Skin Sync!</p>
      <p>
        <Link to="/login">Log in again</Link>
      </p>
    </div>
  );
};

export default Logout;
