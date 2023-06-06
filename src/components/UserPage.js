import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPage = () => {
  const [uvIndex, setUvIndex] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    axios.get('http://localhost:8080/userPage', {
      headers: {
        Authorization: accessToken
      }
    })
      .then((response) => {
        setUvIndex(response.data.uvIndex);
      })
      .catch((error) => {
        console.log('Error fetching UV index:', error);
      });
  }, []);

  return (
    <div>
      <h1>This is the user page</h1>
      {uvIndex !== null && (
        <p>
        The UV index is:
          {' '}
          {uvIndex}
        </p>
      )}
    </div>
  );
}

export default UserPage;
