/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AddProductButton, DeleteProductButton } from '../styles/StyledButtons';
import { UsageLink } from '../styles/StyledLinks';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';
import defaultImage from '../images/default.png';

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  `;

const SkincareProduct = () => {
  const [morningName, setMorningName] = useState('');
  const [morningBrand, setMorningBrand] = useState('');
  const [nightName, setNightName] = useState('');
  const [nightBrand, setNightBrand] = useState('');
  const [morningProducts, setMorningProducts] = useState([]);
  const [nightProducts, setNightProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [morningCategory, setMorningCategory] = useState('');
  const [nightCategory, setNightCategory] = useState('');

  // Gets the categories for the dropdown menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8080/categories', {
          headers: {
            Authorization: accessToken
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCategories(data.categories);
        console.log(categories);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchCategories();
  }, []);

  const getMorningProducts = () => {
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
        category: morningCategory,
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
          setMorningCategory('');
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
        category: nightCategory,
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
          setNightCategory('');
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

  // Uses the chosen category to display the correct image
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

  return (
    <div>
      <h1>Products Shelf</h1>
      <UsageLink to="/productShelf/logUsage">Log my products usage</UsageLink>
      <form onSubmit={handleSubmitMorningRoutine}>
        <h1>Upload your Morning routine</h1>
        <div>
          <label htmlFor="morningName">Name:</label>
          <input type="text" placeholder="product name" id="morningName" value={morningName} onChange={(e) => setMorningName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="morningBrand">Brand:</label>
          <input type="text" placeholder="brand name" id="morningBrand" value={morningBrand} onChange={(e) => setMorningBrand(e.target.value)} />
        </div>
        <div>
          <label htmlFor="morningCategory">Category:</label>
          <select id="morningCategory" value={morningCategory} onChange={(e) => setMorningCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <AddProductButton type="submit">Submit Product</AddProductButton>
      </form>

      <form onSubmit={handleSubmitNightRoutine}>
        <h1>Upload your Night Routine</h1>
        <div>
          <label htmlFor="nightName">Name:</label>
          <input type="text" placeholder="product name" id="nightName" value={nightName} onChange={(e) => setNightName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="nightBrand">Brand:</label>
          <input type="text" placeholder="brand name" id="nightBrand" value={nightBrand} onChange={(e) => setNightBrand(e.target.value)} />
        </div>
        <div>
          <label htmlFor="nightCategory">Category:</label>
          <select id="nightCategory" value={nightCategory} onChange={(e) => setNightCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <AddProductButton type="submit">Submit Product</AddProductButton>
      </form>

      <h2>Morning Shelf</h2>
      {morningProducts.map((product) => (
        <div key={product._id}>
          <ProductImage
            src={getImagePath(product.category)}
            alt={product.category} />
          <p>
      Product Name: {product.name} <br />
      Brand: {product.brand}
          </p>
          <DeleteProductButton type="button" onClick={() => handleDeleteProduct(product._id)}>
      Delete
          </DeleteProductButton>
        </div>
      ))}

      <h2>Night shelf</h2>
      {nightProducts.map((product) => (
        <div key={product._id}>
          <ProductImage
            src={getImagePath(product.category)}
            alt={product.category} />
          <p>
      Product Name: {product.name} <br />
      Brand: {product.brand}
          </p>
          <DeleteProductButton type="button" onClick={() => handleDeleteProduct(product._id)}>Delete product</DeleteProductButton>
        </div>
      ))}
    </div>
  );
}

export default SkincareProduct;
