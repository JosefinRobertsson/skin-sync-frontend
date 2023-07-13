/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ProductFormButton, SaveButton, BackButton } from '../styles/StyledButtons';
import MorningPopUp from './MorningPopUp.js';
import './compCSS/Shelves.css';
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

const handleConfetti = () => {
  confetti({
    particleCount: 180,
    spread: 90,
    startVelocity: 30,
    gravity: 0.4,
    scalar: 0.7,
    origin: { y: 0.5 },
    resize: true,
    ticks: 260,
    disableForReducedMotion: true // For users with motion sensitivity
  });
};

const MorningShelf = ({ morningProducts, getMorningProducts, fetchSkincareProducts }) => {
  const [morningName, setMorningName] = useState('');
  const [morningBrand, setMorningBrand] = useState('');
  const [categories, setCategories] = useState([]);
  const [morningCategory, setMorningCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Gets the categories for the dropdown menu
  useEffect(() => {
    console.log('fetching categories');
    const fetchCategories = async () => {
      console.log('fetching categories2');
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('https://skinsync-server.onrender.com/categories', {
          headers: {
            Authorization: accessToken
          }
        });
        console.log('response', response);
        const { fetchedCategories } = response.data;
        setCategories(fetchedCategories);
        console.log('fetched categories', fetchedCategories);
      } catch (error) {
        console.error('An error occurred:', error.response || error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    getMorningProducts();
  }, []);

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
        name: morningName.charAt(0).toUpperCase() + morningName.slice(1).toLowerCase(),
        brand: morningBrand.charAt(0).toUpperCase() + morningBrand.slice(1).toLowerCase(),
        category: morningCategory,
        routine: 'morning'
      })
    };

    axios.post('/productShelf', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMorningName('');
          setMorningBrand('');
          setMorningCategory('');
          setErrorMsg(null);
          setShowForm(false);
          getMorningProducts();
        } else {
          console.error('Failed to submit Skincare Product');
          setErrorMsg(data.message);
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        setErrorMsg(error.message);
      });
  };

  // Uses the chosen category to display the correct image
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

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const words = value.split(' ');

    const truncatedWords = words.map((word) => {
      if (word.length > 15) {
        return word.substring(0, 15);
      }
      return word;
    });

    const truncatedValue = truncatedWords.join(' ');
    if (truncatedValue.length <= 30) {
      if (id === 'morningName') {
        setMorningName(truncatedValue);
      } else if (id === 'morningBrand') {
        setMorningBrand(truncatedValue);
      }
    }
  };

  const handleCancelClick = () => {
    setMorningName('');
    setMorningBrand('');
    setMorningCategory('');
    setShowForm(false);
  }
  const handleProductSelection = (productId) => {
    const clickedProduct = morningProducts.find((prod) => prod._id === productId);
    setSelectedProduct(clickedProduct);
    handleCancelClick();
  };

  const handleKeyPress = (event, ID) => {
    if (event.key === 'Enter') {
      handleProductSelection(ID)
    }
  };
  // get updated products after popup is closed
  const handlePopUpClose = () => {
    getMorningProducts();
    fetchSkincareProducts();
  };

  const handleAddProductClick = () => {
    setShowForm(!showForm);
    setErrorMsg(null);
  }

  const morningProductCount = morningProducts.filter((product) => !product.archived).length;

  console.log('categories', categories);

  return (
    <div className="shelvesWrapper">
      <h1>Product Shelves</h1>
      <h2>Morning Shelf</h2>
      <div className="productShelf morning">
        {morningProducts
          .filter((product) => !product.archived)
          .map((product) => (
            <div className={`product-container ${product.favorite ? 'favorite' : ''}`} key={uuidv4()}>
              <div
                className="product-item"
                key={product._id}
                onClick={() => handleProductSelection(product._id)}
                onKeyDown={(event) => handleKeyPress(event, product._id)}
                tabIndex={0}
                role="button">
                <img
                  className="product-image"
                  src={getImagePath(product.category)}
                  alt={product.category} />
                <div className="productsnameandbrand">
                  <h5>{product.name}</h5>
                  <h5>{product.brand}</h5>
                </div>
              </div>
            </div>
          ))}
      </div>
      <a href="https://www.flaticon.com/" target="_blank" className="icon-info" rel="noreferrer">
        <span>All icons from Flaticon</span>
      </a>
      <p>{morningProductCount} products</p>
      <p>Click a product to edit</p>
      <ProductFormButton
        type="button"
        onClick={handleAddProductClick}>
        {showForm ? 'Hide form' : 'Add new product'}
      </ProductFormButton>
      <form className="shelf-form" style={{ display: showForm ? 'flex' : 'none' }} onSubmit={handleSubmitMorningRoutine}>
        <fieldset className="fieldset"><legend>Add to Morning shelf</legend>
          <div>
            <label className="labelusage" htmlFor="morningName">Name:</label>
            <input
              type="text"
              placeholder="product name"
              id="morningName"
              value={morningName}
              onChange={handleInputChange}
              required />
          </div>
          <div>
            <label className="labelusage" htmlFor="morningBrand">Brand:</label>
            <input
              type="text"
              placeholder="brand name"
              id="morningBrand"
              value={morningBrand}
              onChange={handleInputChange} />
          </div>
          <div>
            <label className="labelusage" htmlFor="morningCategory">Category:</label>
            <select
              className="select"
              id="morningCategory"
              value={morningCategory}
              onChange={(e) => setMorningCategory(e.target.value)}
              required>
              <option value="" disabled selected>Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <SaveButton
            className="productbutton"
            type="submit"
            onClick={(event) => {
              if (morningName && morningCategory) {
                handleConfetti();
                handleSubmitMorningRoutine(event);
              }
            }}>
            Put on shelf
          </SaveButton>
          <BackButton onClick={handleCancelClick}>
            Cancel
          </BackButton>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </fieldset>
      </form>
      {selectedProduct && (
        <MorningPopUp
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          showForm={showForm}
          setShowForm={setShowForm}
          getImagePath={getImagePath}
          categories={categories}
          morningProducts={morningProducts}
          onClose={handlePopUpClose} />
      )}
    </div>
  );
};

export default MorningShelf;