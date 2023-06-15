/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';
import defaultImage from '../images/default.png';

const getImagePath = (category) => {
  switch (category) {
    case 'cleanser':
      return cleanserImage;
    case 'moisturizer':
      return moisturizerImage;
    case 'serum':
      return serumImage;
    case 'sunscreen':
      return sunscreenImage;
    case 'other':
      return otherImage;
    default:
      return defaultImage;
  }
};

const ProductStatistics = ({ chosenDate }) => {
  const [morningProducts, setMorningProducts] = useState([]);
  const [nightProducts, setNightProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [formattedMorningProducts, setformattedMorningProducts] = useState([]);
  const [formattedNightProducts, setFormattedNightProducts] = useState([]);
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    const fetchSkincareProducts = async () => {
      console.log('fetching skincare products...');
      console.log('chosenDate:', chosenDate);
      // setLoading(true);

      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }
        const config = {
          headers: {
            Authorization: accessToken
          }
        };
        const morningResponse = await axios.get('/productShelf/morning', config);
        console.log('morningResponse:', morningResponse);
        const nightResponse = await axios.get('/productShelf/night', config);
        if (!morningResponse.data.success || !nightResponse.data.success) {
          throw new Error('Failed to fetch skincare products');
        }

        const morningProductsArray = morningResponse.data.response;
        const nightProductsArray = nightResponse.data.response;

        setMorningProducts(morningProductsArray);
        setNightProducts(nightProductsArray);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSkincareProducts();
  }, [chosenDate]);

  // get the week number and day of week from a usageDate in correct format
  const getWeekAndDay = (date) => {
    const weekNumber = moment(date).isoWeek();
    const dayOfWeek = moment(date).isoWeekday();
    return { weekNumber, dayOfWeek };
  };

  // make arrays of products with their respective week number and day of week included
  useEffect(() => {
    const formatProducts = () => {
      const weekMorningData = [];
      const weekNightData = [];

      morningProducts.forEach((product) => {
        product.usageHistory.forEach((usageDate) => {
          const { weekNumber, dayOfWeek } = getWeekAndDay(usageDate);

          const formattedProduct = {
            weekNumber,
            dayOfWeek,
            productId: product._id,
            productName: product.name,
            productBrand: product.brand,
            productCategory: product.category,
            productRoutine: product.routine,
            productUsage: usageDate
          };

          weekMorningData.push(formattedProduct);
        });
      });

      nightProducts.forEach((product) => {
        product.usageHistory.forEach((usageDate) => {
          const { weekNumber, dayOfWeek } = getWeekAndDay(usageDate);

          const formattedProduct = {
            weekNumber,
            dayOfWeek,
            productId: product._id,
            productName: product.name,
            productBrand: product.brand,
            productCategory: product.category,
            productRoutine: product.routine,
            productUsage: usageDate
          };

          weekNightData.push(formattedProduct);
        });
      });

      setformattedMorningProducts(weekMorningData);
      setFormattedNightProducts(weekNightData);
    };

    formatProducts();
  }, [morningProducts, nightProducts]);

  const currentDate = moment(chosenDate);
  const week = [];
  // const startOfWeek = moment(chosenDate).startOf('isoWeek');
  // console.log('startOfWeek:', startOfWeek);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 7; i++) {
    // const day = startOfWeek.clone().add(i, 'days');
    const day = currentDate.clone().startOf('isoWeek').add(i, 'days');
    const formattedDate = day.format('DD/MM');
    week.push({
      number: day.isoWeekday(),
      name: day.format('dddd'),
      date: day.toDate(),
      formattedDate
    });
  }

  return (
    <div>
      {week.map((weekday) => (
        <div className={weekday.name} key={weekday.number}>
          {weekday.name} {weekday.formattedDate}
          <div className={`${weekday.name}Morning`}>
            {formattedMorningProducts
              .filter((data) => moment(data.productUsage).isSame(weekday.date, 'day'))
              .map((data) => (
                <div
                  className="morningProductContainer"
                  key={`${data.productName}-${uuidv4()}`}>
                  <img src={getImagePath(data.productCategory)} alt={data.productCategory} />
                  {data.productName}
                </div>
              ))}
          </div>
          <div className={`${weekday.name}Night`}>
            {formattedNightProducts
              .filter((data) => moment(data.productUsage).isSame(weekday.date, 'day'))
              .map((data) => (
                <div
                  className="nightProductContainer"
                  key={`${data.productName}-${uuidv4()}`}>
                  <img src={getImagePath(data.productCategory)} alt={data.productCategory} />
                  {data.productName}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductStatistics;