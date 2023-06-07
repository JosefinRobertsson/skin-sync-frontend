/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShelfLink } from '../styles/StyledLinks';

const SingleItem = ({ product, handleUsageChange }) => (
  <>
    <div key={product._id}>
      <p>Name: {product.name}</p>
      <p>Brand: {product.brand}</p>
      <label htmlFor={`checkbox-${product._id}`}>
        Used today:
        <input
          type="checkbox"
          checked={product.usedToday}
          onChange={() => handleUsageChange(product._id, product.usedToday)} />
      </label>
    </div>
    <div>
      <ShelfLink to="/productShelf">Edit routine</ShelfLink>
    </div>
  </>
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

  const handleUsageChange = async (productId, usedToday) => {
    try {
      const response = await axios.post('/productShelf/logUsage', {
        productId,
        usedToday: !usedToday
      });
      if (response.data.success) {
        // Update the usedToday state in the corresponding product
        const updatedMorningProducts = morningProducts.map((product) => (product._id === productId
          ? { ...product, usedToday: !usedToday } : product));
        const updatedNightProducts = nightProducts.map((product) => (product._id === productId
          ? { ...product, usedToday: !usedToday } : product));

        setMorningProducts(updatedMorningProducts);
        setNightProducts(updatedNightProducts);
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
    <div>
      <h2>Morning Routine</h2>
      {morningProducts.map((product) => (
        <SingleItem key={product._id} product={product} handleUsageChange={handleUsageChange} />
      ))}

      <h2>Night Routine</h2>
      {nightProducts.map((product) => (
        <SingleItem key={product._id} product={product} handleUsageChange={handleUsageChange} />
      ))}
    </div>
  );
};

export default UsageTracker;
