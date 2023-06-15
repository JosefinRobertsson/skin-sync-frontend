/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import confetti from 'canvas-confetti';

import ReactSimplyCarousel from 'react-simply-carousel';
import { AddProductButton, DeleteProductButton } from '../styles/StyledButtons';
import { UsageLink } from '../styles/StyledLinks';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';
import defaultImage from '../images/default.png';
import './MorningShelf.css'
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
    origin: { y: 0.9 },
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
          console.log(data)
          // console.log('Night routine product submitted successfully');
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
        setNightEditing(true); // Set morningEditing to true
        console.log('editing night category:', product.category)
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
            background: 'black',
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
            background: 'black',
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
            itemsToShow: 3,
            itemsToScroll: 1,
            minWidth: 768
          }
        ]}
        speed={400}
        easing="linear">
        {nightProducts.map((product) => (
          <div className="carousel-item" key={product._id} style={{ width: 200, height: 200, background: '#FFF5E9' }}>
            <ProductImage
              src={getImagePath(product.category)}
              alt={product.category}
              onClick={() => handleNightEdit(product._id)} />

            <h5> {product.name} </h5>
            <h6> {product.brand} </h6>

          </div>
        ))}
      </ReactSimplyCarousel>
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
              onChange={(e) => setNightName(e.target.value)}
              required />
          </div>

          <div>
            <label className="labelusage" htmlFor="nightBrand">Brand:</label>
            <input
              type="text"
              placeholder="brand name"
              id="nightBrand"
              value={nightBrand}
              onChange={(e) => setNightBrand(e.target.value)} />
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