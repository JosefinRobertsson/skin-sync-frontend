/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { PopUp } from './PopUp';
import './compCSS/ProductStatistics.css'
import bodylotionImage from '../images/body lotion.png';
import cleanserImage from '../images/cleanser.png';
import herbalImage from '../images/herbal remedy.png';
import mistImage from '../images/mist.png';
import moisturizerImage from '../images/moisturizer.png';
import oilImage from '../images/oil.png';
import peelingImage from '../images/peeling.png';
import serumImage from '../images/serum.png';
import soapImage from '../images/soap.png';
import spotImage from '../images/spot-treatment.png';
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';

const getImagePath = (category) => {
  switch (category) {
    case 'body lotion':
      return bodylotionImage;
    case 'cleanser':
      return cleanserImage;
    case 'herbal remedy':
      return herbalImage;
    case 'mist':
      return mistImage;
    case 'moisturizer':
      return moisturizerImage;
    case 'oil':
      return oilImage;
    case 'peeling':
      return peelingImage;
    case 'serum':
      return serumImage;
    case 'soap':
      return soapImage;
    case 'spot-treatment':
      return spotImage;
    case 'sunscreen':
      return sunscreenImage;
    case 'other':
      return otherImage;
    default:
      return otherImage;
  }
};

const ProductStatistics = ({ chosenDate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formattedMorningProducts, setformattedMorningProducts] = useState([]);
  const [formattedNightProducts, setFormattedNightProducts] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // axios.defaults.baseURL = ' https://skinsync-mgydyyeela-no.a.run.app';
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    const fetchSkincareProducts = async () => {
      setLoading(true);
      let morningResponse;
      let nightResponse;

      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No access token found');
          setLoading(false);
          return;
        }
        const config = {
          headers: {
            Authorization: accessToken
          }
        };

        morningResponse = await axios.get('/productShelf/morning', config);
        nightResponse = await axios.get('/productShelf/night', config);
        if (!morningResponse.data.success || !nightResponse.data.success) {
          throw new Error('Failed to fetch skincare products');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
      const mergedProducts = [...morningResponse.data.response, ...nightResponse.data.response];

      setProducts(mergedProducts);
      setLoading(false);
    };

    if (loading) {
      return <p>Loading statistics, please wait...</p>;
    }
    fetchSkincareProducts();
  }, []);

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

      products.forEach((product) => {
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
            productUsage: usageDate,
            usageCount: product.usageHistory.length
          };

          if (product.routine === 'morning') {
            weekMorningData.push(formattedProduct);
          } else if (product.routine === 'night') {
            weekNightData.push(formattedProduct);
          }
        });
      });
      setformattedMorningProducts(weekMorningData);
      setFormattedNightProducts(weekNightData);
    };
    formatProducts();
  }, [products]);

  const currentDate = moment(chosenDate);
  const week = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 7; i++) {
    const day = currentDate.clone().startOf('isoWeek').add(i, 'days');
    const formattedDate = day.format('DD/MM');
    week.push({
      number: day.isoWeekday(),
      name: day.format('dddd'),
      date: day.toDate(),
      formattedDate
    });
  }

  const handleProductSelection = (data) => {
    setSelectedProduct(data);
    setShowPopUp(true);
    console.log(showPopUp);
  };

  const handleKeyPress = (event, data) => {
    if (event.key === 'Enter') {
      handleProductSelection(data);
    }
  };

  return (
    <div className="productsWrapper">
      <h2>Skincare used</h2>
      {week.map((weekday) => (
        <div className={`${weekday.name} daysAndNights`} key={weekday.number}>
          {weekday.name} {weekday.formattedDate}
          <div className={`${weekday.name}Morning allMornings`}>
            {formattedMorningProducts
              .filter((data) => moment(data.productUsage).isSame(weekday.date, 'day'))
              .map((data) => (
                <div
                  className="morningProductContainer"
                  key={`${data.productName}-${uuidv4()}`}
                  onClick={() => handleProductSelection(data)}
                  onKeyDown={(event) => handleKeyPress(event, data)}
                  tabIndex={0}
                  role="button">
                  <img src={getImagePath(data.productCategory)} alt={data.productCategory} />
                  <span>{data.productName}</span>
                </div>
              ))}
          </div>
          <div className={`${weekday.name}Night allNights`}>
            {formattedNightProducts
              .filter((data) => moment(data.productUsage).isSame(weekday.date, 'day'))
              .map((data) => (
                <div
                  className="nightProductContainer"
                  key={`${data.productName}-${uuidv4()}`}
                  onClick={() => handleProductSelection(data)}
                  onKeyDown={(event) => handleKeyPress(event, data)}
                  tabIndex={0}
                  role="button">
                  <img src={getImagePath(data.productCategory)} alt={data.productCategory} />
                  <span>{data.productName}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
      {selectedProduct && (
        <PopUp
          data={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          getImagePath={getImagePath}
          setShowPopUp={setShowPopUp}
          showPopUp={showPopUp} />
      )}
    </div>
  );
};

export default ProductStatistics;