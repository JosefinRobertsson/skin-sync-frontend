/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import ReactSimplyCarousel from 'react-simply-carousel';
import { AddProductButton, DeleteProductButton } from '../styles/StyledButtons';
import { UsageLink } from '../styles/StyledLinks';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';
import defaultImage from '../images/default.png';
import './compCSS/Shelves.css';
/*
const SingleProductWrapper = styled.div`
  display: flex;
  border: 1px solid black;
  `
*/
const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
  `;

const handleConfetti = () => {
  confetti({
    particleCount: 180,
    spread: 90,
    startVelocity: 30,
    gravity: 0.4,
    scalar: 0.7,
    origin: { y: 0.7 },
    resize: true,
    ticks: 260,
    disableForReducedMotion: true // For users with motion sensitivity
  });
};

const NightShelf = () => {
  const [nightName, setNightName] = useState('');
  const [nightBrand, setNightBrand] = useState('');
  const [nightProducts, setNightProducts] = useState([]);
  const [nightEditing, setNightEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [nightCategory, setNightCategory] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef(null);
  const [activeSlideIndexNight, setActiveSlideIndexNight] = useState(0);

  // Gets the categories for the dropdown menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(' http://localhost:8080/categories', {
        // const response = await fetch(' https://skinsync-mgydyyeela-no.a.run.app/categories', {
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

  // Extra safety for delete button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setClickCount(0);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [buttonRef]);

  const getNightProducts = () => {
    const accessToken = localStorage.getItem('accessToken');
    fetch('http://localhost:8080/productShelf/night', {
    // fetch(' https://skinsync-mgydyyeela-no.a.run.app/productShelf/night', {
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
    handleConfetti();

    const accessToken = localStorage.getItem('accessToken');
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      body: JSON.stringify({
        name: nightName.charAt(0).toUpperCase() + nightName.slice(1),
        brand: nightBrand.charAt(0).toUpperCase() + nightBrand.slice(1),
        category: nightCategory,
        routine: 'night'
      })
    };

    let requestUrl = 'http://localhost:8080/productShelf';
    // let requestUrl = ' https://skinsync-mgydyyeela-no.a.run.app/productShelf';
    let requestMethod = 'POST';

    if (editingProductId) {
      requestUrl += `/${editingProductId}`;
      requestMethod = 'PUT';
    }

    fetch(requestUrl, { ...options, method: requestMethod })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
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
    if (clickCount === 0) {
      setClickCount(1);
    } else {
      const accessToken = localStorage.getItem('accessToken');
      fetch(` http://localhost:8080/productShelf/${productId}`, {
      // fetch(` https://skinsync-mgydyyeela-no.a.run.app/productShelf/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            getNightProducts();
          } else {
            console.error('Failed to delete product');
          }
          setNightName('');
          setNightBrand('');
          setNightCategory('');
          setClickCount(0);
          setNightEditing(false);
        });
    }
  };

  // EDIT
  const handleNightEdit = (productId) => {
    setNightName('');
    setNightBrand('');
    setNightCategory('');

    if (editingProductId === productId) {
      setEditingProductId(null); // Hide the form if the same product image is clicked again
      setNightEditing(false);
    } else {
      const product = nightProducts.find((prod) => prod._id === productId);
      if (product) {
        setNightName(product.name);
        setNightBrand(product.brand);
        setNightCategory(product.category);
        setEditingProductId(productId);
        setNightEditing(true);
      }
    }
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // eslint-disable-next-line no-undef
      handleNightEdit(product._id)
    }
  };

  const nightProductCount = nightProducts.length;

  return (
    <div className="bodyshelves">
      <h2>Night shelf</h2>
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndexNight}
        onRequestChange={setActiveSlideIndexNight}
        itemsToShow={1}
        itemsToScroll={1}
        forwardBtnProps={{
          // here you can also pass className, or any other button element attributes
          style: {
            alignSelf: 'center',
            background: '#3F1C3A',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            height: 30,
            lineHeight: 1,
            textAlign: 'center',
            width: 30
          },
          children: <span>{'>'}</span>
        }}
        backwardBtnProps={{
          // here you can also pass className, or any other button element attributes
          style: {
            alignSelf: 'center',
            background: '#3F1C3A',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            height: 30,
            lineHeight: 1,
            textAlign: 'center',
            width: 30
          },
          children: <span>{'<'}</span>
        }}
        responsiveProps={[
          {
            itemsToShow: 2,
            itemsToScroll: 1,
            minWidth: 200
          }
        ]}
        speed={300}
        easing="linear">
        {nightProducts.map((product) => (
          <div className="carousel-item-wrapper" key={uuidv4()}>
            <div
              className="carousel-item nightCarousel"
              key={product._id}
              onClick={() => handleNightEdit(product._id)}
              onKeyDown={(event) => handleKeyPress(event, product._id)}
              tabIndex={0}
              role="button">
              <ProductImage
                src={getImagePath(product.category)}
                alt={product.category} />

              <div className="productsnameandbrand">
                <span>{product.name}</span>
                <span>{product.brand}</span>
              </div>
            </div>
          </div>
        ))}
      </ReactSimplyCarousel>
      <p>{nightProductCount} products</p>
      <p>Click a product to edit</p>

      <form className="form-wrapper" onSubmit={handleSubmitNightRoutine}>
        <fieldset className="fieldset"><legend>{nightEditing ? 'Edit ' : 'Add to '}Night shelf</legend>
          <div>
            <label className="labelusage" htmlFor="nightName">Name:</label>
            <input
              className="input"
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
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <AddProductButton
            className="productbutton"
            type="submit">
            {nightEditing ? 'Save change' : 'Put on shelf'}
          </AddProductButton>
          <DeleteProductButton
            className="productbutton"
            type="button"
            onClick={() => handleDeleteProduct(editingProductId)}
            clicked={clickCount > 0}
            ref={buttonRef}
            isVisible={nightEditing}>
            {clickCount === 0 ? 'Delete' : 'Delete product?'}
          </DeleteProductButton>
        </fieldset>
        <UsageLink className="logusagebutton" to="/productShelf/logUsage">Log my products usage</UsageLink>
      </form>
    </div>
  );
}

export default NightShelf;