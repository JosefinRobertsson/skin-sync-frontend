/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const ProductStatistics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formattedMorningProducts, setformattedMorningProducts] = useState([]);
  const [formattedNightProducts, setFormattedNightProducts] = useState([]);

  // a fetch from both shelves to get the products
  useEffect(() => {
    const fetchSkincareProducts = async () => {
      setLoading(true);
      let morningResponse;
      let nightResponse;

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
      console.log('mergedProducts:', mergedProducts);
      setLoading(false);
    };

    if (loading) {
      return <p>Loading statistics, please wait...</p>;
    }
    fetchSkincareProducts();
  }, []);

  // get the week number and day of week from a date in correct format
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
            productCategory: product.category
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

  return (
    <div className="weekdayWrapper">
      <div className="monday">
        <div className="mondayMorning">
          {formattedMorningProducts
            .filter((data) => data.dayOfWeek === 1)
            .map((data) => (
              <div className="morning" key={data.productId}>{data.productCategory}{data.productName}</div>
            ))}
        </div>
        <div className="mondayNight">
          {formattedNightProducts
            .filter((data) => data.dayOfWeek === 1)
            .map((data) => (
              <div className="night" key={data.productId}>{data.productName}</div>
            ))}
        </div>
      </div>
      <div className="tuesday">
        <div className="morning" />
        <div className="night" />
      </div>
      <div className="wednesday">
        <div className="morning" />
        <div className="night" />
      </div>
      <div className="thursday">
        <div className="morning" />
        <div className="night" />
      </div>
      <div className="friday">
        <div className="morning" />
        <div className="night" />
      </div>
      <div className="saturday">
        <div className="morning" />
        <div className="night" />
      </div>
      <div className="sunday">
        <div className="morning" />
        <div className="night" />
      </div>
    </div>
  );
};

export default ProductStatistics;