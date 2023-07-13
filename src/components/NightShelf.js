/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import { ProductFormButton, SaveButton, BackButton, ArchiveButton } from '../styles/StyledButtons';
import NightPopUp from './NightPopUp.js';
import Archive from './Archive.js';
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

const NightShelf = ({
  getMorningProducts,
  fetchSkincareProducts,
  archivedProducts,
  loading
}) => {
  const [nightName, setNightName] = useState('');
  const [nightBrand, setNightBrand] = useState('');
  const [nightProducts, setNightProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nightCategory, setNightCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Gets the categories for the dropdown menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        // const response = await fetch('http://localhost:8080/categories', {
        const response = await fetch('https://skinsync-server.onrender.com/categories', {
          headers: {
            Authorization: accessToken
          }
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchCategories();
  }, []);

  const getNightProducts = () => {
    const accessToken = localStorage.getItem('accessToken');
    // fetch('http://localhost:8080/productShelf/night', {
    fetch('https://skinsync-server.onrender.com/productShelf/night', {
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

  const handleSubmitNightRoutine = (event) => {
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
        name: nightName.charAt(0).toUpperCase() + nightName.slice(1).toLowerCase(),
        brand: nightBrand.charAt(0).toUpperCase() + nightBrand.slice(1).toLowerCase(),
        category: nightCategory,
        routine: 'night'
      })
    };

    fetch('https://skinsync-server.onrender.com/productShelf', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNightName('');
          setNightBrand('');
          setNightCategory('');
          setErrorMsg(null);
          setShowForm(false);
          getNightProducts();
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
      if (id === 'nightName') {
        setNightName(truncatedValue);
      } else if (id === 'nightBrand') {
        setNightBrand(truncatedValue);
      }
    }
  };

  const handleCancelClick = () => {
    setNightName('');
    setNightBrand('');
    setNightCategory('');
    setShowForm(false);
  }
  const handleProductSelection = (productId) => {
    const clickedProduct = nightProducts.find((prod) => prod._id === productId);
    setSelectedProduct(clickedProduct);
    handleCancelClick()
  };

  const handleKeyPress = (event, ID) => {
    if (event.key === 'Enter') {
      handleProductSelection(ID)
    }
  };
  // get updated products after popup is closed
  const handlePopUpClose = () => {
    getNightProducts();
    fetchSkincareProducts();
  };

  const handleAddProductClick = () => {
    setShowForm(!showForm);
    setErrorMsg(null);
  }

  const nightProductCount = nightProducts.filter((product) => !product.archived).length;

  return (
    <div className="shelvesWrapper">
      <hr />
      <h2>Night Shelf</h2>
      <div className="productShelf night">
        {nightProducts
          .filter((product) => !product.archived)
          .map((product) => (
            <div className={`product-container ${product.favorite ? 'favorite' : ''}`} key={uuidv4()}>
              <div
                className="product-item nightProduct"
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
      <p>{nightProductCount} products</p>
      <p>Click a product to edit</p>
      <ProductFormButton
        type="button"
        onClick={handleAddProductClick}>
        {showForm ? 'Hide form' : 'Add new product'}
      </ProductFormButton>
      <form className="shelf-form" style={{ display: showForm ? 'flex' : 'none' }} onSubmit={handleSubmitNightRoutine}>
        <fieldset className="fieldset"><legend>Add to Night shelf</legend>
          <div>
            <label className="labelusage" htmlFor="nightName">Name:</label>
            <input
              type="text"
              placeholder="product name"
              id="nightName"
              value={nightName}
              onChange={handleInputChange}
              required />
          </div>
          <div>
            <label className="labelusage" htmlFor="nightBrand">Brand:</label>
            <input
              type="text"
              placeholder="brand name"
              id="nightBrand"
              value={nightBrand}
              onChange={handleInputChange} />
          </div>
          <div>
            <label className="labelusage" htmlFor="nightCategory">Category:</label>
            <select
              className="select"
              id="nightCategory"
              value={nightCategory}
              onChange={(e) => setNightCategory(e.target.value)}
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
              if (nightName && nightCategory) {
                handleConfetti();
                handleSubmitNightRoutine(event);
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
      <ArchiveButton onClick={() => {
        setShowArchive(!showArchive);
        if (!showArchive) {
          fetchSkincareProducts();
        }
      }}>
        {showArchive ? 'Hide archive' : 'Show archive'}
      </ArchiveButton>
      {selectedProduct && (
        <NightPopUp
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          getImagePath={getImagePath}
          categories={categories}
          nightProducts={nightProducts}
          onClose={handlePopUpClose} />
      )}
      {showArchive && (
        <Archive
          getNightProducts={getNightProducts}
          getMorningProducts={getMorningProducts}
          fetchSkincareProducts={fetchSkincareProducts}
          archivedProducts={archivedProducts}
          loading={loading} />
      )}
    </div>
  );
};

export default NightShelf;