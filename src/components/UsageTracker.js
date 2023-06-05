/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsageTracker() {
  // Create a state to store the skincare products
  const [skincareProducts, setSkincareProducts] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    axios.get('http://localhost:8080/skincareProduct', {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => {
        if (response.data.success) {
          setSkincareProducts(response.data.response);
        } else {
          console.error('Failed to fetch skincare products');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  }, []);

  const handleProductUsage = (productId, usedToday) => {
    const accessToken = localStorage.getItem('accessToken');
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        usedToday: !usedToday,
      }),
    };

    axios.patch(`http://localhost:8080/skincareProduct/${productId}`, options)
      .then((response) => {
        if (response.data.success) {
          console.log('Product usage updated successfully');
          const updatedProducts = skincareProducts.map((product) => {
            if (product._id === productId) {
              return {
                ...product,
                usedToday: !usedToday,
              };
            }
            return product;
          });
          setSkincareProducts(updatedProducts);
        } else {
          console.error('Failed to update product usage');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  return (
    <div>
      <h1>This is the Usage Tracker Page</h1>
      {skincareProducts.map((product) => (
        <div key={product._id}>
          <p>
            Product Name:
            {' '}
            {product.name}
            {' '}
            <br />
            Brand:
            {' '}
            {product.brand}
          </p>
          <label htmlFor={`productUsage-${product._id}`}>
            Used Today:
            <input
              type="checkbox"
              id={`productUsage-${product._id}`}
              checked={product.usedToday}
              onChange={() => handleProductUsage(product._id, product.usedToday)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default UsageTracker;
