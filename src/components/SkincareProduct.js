/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { AddProductButton, DeleteProductButton } from '../styles/StyledButtons';
import { UsageLink } from '../styles/StyledLinks';

const SkincareProduct = () => {
  const [morningName, setMorningName] = useState('');
  const [morningBrand, setMorningBrand] = useState('');
  const [nightName, setNightName] = useState('');
  const [nightBrand, setNightBrand] = useState('');
  const [morningProducts, setMorningProducts] = useState([]);
  const [nightProducts, setNightProducts] = useState([]);

  const getMorningProducts = () => {
    // Replace with your actual API call for morning products
    const accessToken = localStorage.getItem('accessToken');
    fetch('http://localhost:8080/productShelf/morning', {
      headers: {
        Authorization: accessToken
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMorningProducts(data.response);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  const getNightProducts = () => {
    // Replace with your actual API call for night products
    const accessToken = localStorage.getItem('accessToken');
    fetch('http://localhost:8080/productShelf/night', {
      headers: {
        Authorization: accessToken
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setNightProducts(data.response);
      });
  };

  useEffect(() => {
    getMorningProducts();
    getNightProducts();
  }, []);

  // MORNING

  // Separate the morning and night products
  const morningRoutineProducts = morningProducts.filter((product) => product.routine === 'morning');
  const nightRoutineProducts = nightProducts.filter((product) => product.routine === 'night');

  const handleSubmitMorningRoutine = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    // eslint-disable-next-line no-unused-vars
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      body: JSON.stringify({
        name: morningName,
        brand: morningBrand,
        routine: 'morning'
      })
    };

    fetch('http://localhost:8080/productShelf', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Morning routine product submitted successfully');
          setMorningName('');
          setMorningBrand('');
          getMorningProducts();
        } else {
          console.error('Failed to submit Skincare Product');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  // NIGHT

  const handleSubmitNightRoutine = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      body: JSON.stringify({
        name: nightName,
        brand: nightBrand,
        routine: 'night'
      })
    };

    fetch('http://localhost:8080/productShelf', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Night routine product submitted successfully');
          setNightName('');
          setNightBrand('');
          getNightProducts();
        } else {
          console.error('Failed to submit Skincare Product');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  // DELETE

  const handleDeleteProduct = (productId) => {
    const accessToken = localStorage.getItem('accessToken');
    fetch(`http://localhost:8080/productShelf/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: accessToken
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('Product deleted successfully');
          getMorningProducts();
          getNightProducts();
        } else {
          console.error('Failed to delete product');
        }
      });
  };

  return (
    <div>
      <h1>Products Shelf</h1>
      <UsageLink to="/productShelf/logUsage">Log my products usage</UsageLink>
      <form onSubmit={handleSubmitMorningRoutine}>
        <h1>Upload your Morning routine</h1>
        <div>
          <label htmlFor="morningName">Name of the product:</label>
          <input type="text" id="morningName" value={morningName} onChange={(e) => setMorningName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="morningBrand">Brand of the product:</label>
          <input type="text" id="morningBrand" value={morningBrand} onChange={(e) => setMorningBrand(e.target.value)} />
        </div>
        <AddProductButton type="submit">Submit Product</AddProductButton>
      </form>

      <form onSubmit={handleSubmitNightRoutine}>
        <h1>Upload your Night Routine</h1>
        <div>
          <label htmlFor="nightName">Name of the product:</label>
          <input type="text" id="nightName" value={nightName} onChange={(e) => setNightName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="nightBrand">Brand of the product:</label>
          <input type="text" id="nightBrand" value={nightBrand} onChange={(e) => setNightBrand(e.target.value)} />
        </div>
        <AddProductButton type="submit">Submit Product</AddProductButton>
      </form>

      <h2>Added Products for the Morning routine</h2>
      {morningProducts.map((product) => (
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
          <DeleteProductButton type="button" onClick={() => handleDeleteProduct(product._id)}>Delete</DeleteProductButton>
        </div>
      ))}

      <h2>Added Products for the Night routine</h2>
      {nightProducts.map((product) => (
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
          <DeleteProductButton type="button" onClick={() => handleDeleteProduct(product._id)}>Delete product</DeleteProductButton>
        </div>
      ))}
    </div>
  );
}

export default SkincareProduct;
