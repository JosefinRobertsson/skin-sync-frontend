/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import './UsageTracker.css';
import { ShelfLink } from '../styles/StyledLinks';

const SingleItem = ({ product, handleUsageChange }) => (
  <div className="productItem" key={product._id}>
    <p>Name: {product.name}</p>
    <p>Brand: {product.brand}</p>
    <label htmlFor={`toggle-${product._id}`}>
      Used today:
      <Toggle
        id={`toggle-${product._id}`}
        checked={product.usedToday}
        onChange={() => handleUsageChange(product)} />
    </label>
  </div>
);

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
      {morningProducts.map((product) => (
        <SingleItem
          key={product._id}
          product={product}
          handleUsageChange={handleUsageChange} />
      ))}

      <h2>Night Routine</h2>
      <div>
        <ShelfLink to="/productShelf">Edit routine</ShelfLink>
      </div>
      {nightProducts.map((product) => (
        <SingleItem
          key={product._id}
          product={product}
          handleUsageChange={handleUsageChange} />
      ))}
    </div>
  );
};

export default UsageTracker;
