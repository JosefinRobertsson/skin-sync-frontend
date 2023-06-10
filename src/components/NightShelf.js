/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
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

const SingleProductWrapper = styled.div`
  display: flex;
  border: 1px solid black;
  `

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
  `;

const NightShelf = () => {
  const [nightName, setNightName] = useState('');
  const [nightBrand, setNightBrand] = useState('');
  const [nightProducts, setNightProducts] = useState([]);
  const [nightEditing, setNightEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
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

  const getNightProducts = () => {
    const accessToken = localStorage.getItem('accessToken');
    fetch('http://localhost:8080/productShelf/night', {
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
        setNightProducts(data.response);
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  useEffect(() => {
    getNightProducts();
  }, []);

  // const nightRoutineProducts = nightProducts.filter((product) => product.routine === 'night');

  const handleSubmitNightRoutine = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const options = {
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

    let requestUrl = 'http://localhost:8080/productShelf';
    let requestMethod = 'POST';

    if (editingProductId) {
      requestUrl += `/${editingProductId}`;
      requestMethod = 'PUT';
    }

    fetch(requestUrl, { ...options, method: requestMethod })
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
          getNightProducts();
        } else {
          console.error('Failed to delete product');
        }
      });
  };

  const handleNightEdit = (product) => {
    setNightEditing(true);
    setNightName(product.name);
    setNightBrand(product.brand);
    setNightCategory(product.category);
    setEditingProductId(product._id);
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
    <>
      <UsageLink to="/productShelf/logUsage">Log my products usage</UsageLink>
      <h2>Night shelf</h2>
      <SingleProductWrapper>
        {nightProducts.map((product) => (
          <div key={product._id}>
            <ProductImage
              src={getImagePath(product.category)}
              alt={product.category}
              onClick={() => handleNightEdit(product)} />
            <p>
              Product Name: {product.name} <br />
              Brand: {product.brand}
            </p>
            <DeleteProductButton type="button" onClick={() => handleDeleteProduct(product._id)}>Delete</DeleteProductButton>
          </div>
        ))}
      </SingleProductWrapper>
      <form onSubmit={handleSubmitNightRoutine}>
        <h1>{nightEditing ? 'Edit ' : 'Upload your '}Night Routine</h1>
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
        <AddProductButton type="submit">{nightEditing ? 'Save change' : 'Put on shelf'}</AddProductButton>
      </form>
    </>
  );
}

export default NightShelf;