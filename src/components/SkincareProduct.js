/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

function SkincareProduct() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');

  const handleSubmitProduct = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        name,
        brand,
      }),
    };

    fetch('http://localhost:8080/skincareProduct', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Skincare product submitted successfully');
          setName('');
          setBrand('');
        } else {
          console.error('Failed to submit Skincare Product');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  return (
    <div>
      <h1>Products shelf</h1>
      <form onSubmit={handleSubmitProduct}>
        <div>
          <label htmlFor="name">Name of the product:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="brand">Brand of the product:</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
}

export default SkincareProduct;
