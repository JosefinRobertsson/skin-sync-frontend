/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import './UsageTracker.css';
import Slider from 'react-slick';
import '../styles/slick.css';
import '../styles/slick-theme.css';
import '../styles/slick-docs.css';
import { ShelfLink } from '../styles/StyledLinks';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';
import defaultImage from '../images/default.png';

const settings = {
  dots: true,
  arrows: true,
  swipe: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 2000
};

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
/*
const SingleItem = ({ product, handleUsageChange }) => (
  <>
    <div className="productItem" key={product._id}>
      <img
        src={getImagePath(product.category)}
        alt={product.category} />
      <p>Name: {product.name}</p>
      <p>Brand: {product.brand}</p>
    </div>
    <div>
      <label htmlFor={`toggle-${product._id}`}>
        Used today:
        <Toggle
          id={`toggle-${product._id}`}
          checked={product.usedToday}
          onChange={() => handleUsageChange(product)} />
      </label>
    </div>
  </>
);
*/
const UsageTracker = () => {
  const [morningProducts, setMorningProducts] = useState([]);
  const [nightProducts, setNightProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    const fetchSkincareProducts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('No access token found');
          return;
        }
        const config = {
          headers: {
            Authorization: accessToken
          }
        };

        const morningResponse = await axios.get('/productShelf/morning', config);
        const nightResponse = await axios.get('/productShelf/night', config);
        if (!morningResponse.data.success || !nightResponse.data.success) {
          throw new Error('Failed to fetch skincare products');
        }
        setMorningProducts(morningResponse.data.response);
        setNightProducts(nightResponse.data.response);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch skincare products');
      }
    };

    fetchSkincareProducts();
  }, []);

  const handleUsageChange = async (product) => {
    try {
      const { _id: productId, usedToday, usageHistory } = product;
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }
      const config = {
        headers: {
          Authorization: accessToken
        }
      };
      const updatedUsedToday = !usedToday;
      const updatedUsageHistory = [...usageHistory];
      if (updatedUsedToday) {
        updatedUsageHistory.push(new Date());
      } else {
        updatedUsageHistory.pop();
        console.log('popped:', updatedUsageHistory);
        console.log('length:', updatedUsageHistory.length);
      }

      const response = await axios.post(
        '/productShelf/logUsage',
        {
          productId,
          usedToday: updatedUsedToday,
          usageHistory: updatedUsageHistory
        },
        config
      );

      if (response.data.success) {
        console.log('response:', response.data.response);
        setMorningProducts(
          (prevMorningProducts) => prevMorningProducts.map((product) => (product._id === productId
            ? { ...product, usedToday: updatedUsedToday, usageHistory: updatedUsageHistory }
            : product))
        );

        setNightProducts(
          (prevNightProducts) => prevNightProducts.map((product) => (product._id === productId
            ? { ...product, usedToday: updatedUsedToday, usageHistory: updatedUsageHistory }
            : product))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="UsageTracker">
      <h2>Morning Routine</h2>
      <div>
        <ShelfLink to="/productShelf">Edit routine</ShelfLink>
      </div>
      <Slider {...settings}>
        {morningProducts.map((product) => (
          <div className="productItem" key={product._id}>
            <img src={getImagePath(product.category)} alt={product.category} />
            <p>{product.name}</p>
            <p>{product.brand}</p>
            <div>
              <label htmlFor={`toggle-${product._id}`}>
                Used today:
                <Toggle
                  id={`toggle-${product._id}`}
                  checked={product.usedToday}
                  onChange={() => handleUsageChange(product)} />
              </label>
            </div>
          </div>
        ))}
      </Slider>
      <h2>Night Routine</h2>
      <div>
        <ShelfLink to="/productShelf">Edit routine</ShelfLink>
      </div>
      <Slider {...settings}>
        {nightProducts.map((product) => (
          <div className="productItem" key={product._id}>
            <img src={getImagePath(product.category)} alt={product.category} />
            <p>{product.name}</p>
            <p>{product.brand}</p>
            <div>
              <label htmlFor={`toggle-${product._id}`}>
                Used today:
                <Toggle
                  id={`toggle-${product._id}`}
                  checked={product.usedToday}
                  onChange={() => handleUsageChange(product)} />
              </label>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default UsageTracker;
