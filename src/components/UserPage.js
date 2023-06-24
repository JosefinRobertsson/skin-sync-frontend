/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zoom } from 'react-awesome-reveal';
import { DailyLink, ShelfLink, StatisticsLink } from '../styles/StyledLinks';
import './UserPage.css';
import dailyImage from '../images/dailyImage.png';
import shelfImage from '../images/shelfImage.png';
import statisticsImage from '../images/statisticsImage.png';

const UserPage = ({ username }) => {
  const [uvIndex, setUvIndex] = useState(null);

  useEffect(() => {
    const fetchUVIndex = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        // const response = await axios.get('http://localhost:8080/userPage', {
        const response = await axios.get(' https://skinsync-mgydyyeela-no.a.run.app/userPage', {
          headers: {
            Authorization: accessToken
          }
        });
        const { uvIndex } = response.data;
        setUvIndex(uvIndex);
      } catch (error) {
        // console.error('Error fetching UV index:', error);
      }
    };

    fetchUVIndex();
  }, []);

  return (
    <div className="my-background-class">
      <div className="user-page">
        <div>
          <div>
            <Zoom>
              <h1>Welcome {username}!</h1>
            </Zoom>
            {uvIndex !== null && (
              <div className="uv-index-box">
                <h9> The UV index is:</h9>
                <h1> {uvIndex} </h1>
                <h2>Remember to wear sunscreen!</h2>

              </div>
            )}
          </div>

          <div>
            <div className="imagesandbuttons">
              <img src={dailyImage} alt="Daily Report" className="button-image1" />
              <DailyLink to="/DailyReport" className="route-button">
              Log day
              </DailyLink>
            </div>

            <div className="imagesandbuttons">
              <img src={shelfImage} alt="Product Shelf" className="button-image2" />
              <ShelfLink to="/productShelf" className="route-button">
              Product shelf
              </ShelfLink>
            </div>

            <div className="imagesandbuttons">
              <img src={statisticsImage} alt="Statistics" className="button-image3" />
              <StatisticsLink to="/statisticsPage" className="route-button">
              Statistics
              </StatisticsLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
