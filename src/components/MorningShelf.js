/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import confetti from 'canvas-confetti';
import { Slide } from 'react-awesome-reveal';
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
import Shelfblob from '../images/Shelfblob.png'

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
    origin: { y: 0.5 },
    resize: true,
    ticks: 260,
    disableForReducedMotion: true // For users with motion sensitivity
  });
};

const MorningShelf = () => {
  const [morningName, setMorningName] = useState('');
  const [morningBrand, setMorningBrand] = useState('');
  const [morningProducts, setMorningProducts] = useState([]);
  const [morningEditing, setMorningEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [morningCategory, setMorningCategory] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Gets the categories for the dropdown menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('https://skinsync-mgydyyeela-no.a.run.app/categories', {
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

  const getMorningProducts = () => {
    const accessToken = localStorage.getItem('accessToken');
    fetch('https://skinsync-mgydyyeela-no.a.run.app/productShelf/morning', {
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

  useEffect(() => {
    getMorningProducts();
  }, []);

  // MORNING

  const handleSubmitMorningRoutine = (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    // eslint-disable-next-line no-unused-vars
    const options = {
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

    let requestUrl = ' https://skinsync-mgydyyeela-no.a.run.app/productShelf';
    let requestMethod = 'POST';

    if (editingProductId) {
      requestUrl += `/${editingProductId}`;
      requestMethod = 'PUT';
    }

    fetch(requestUrl, { ...options, method: requestMethod })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMorningName('');
          setMorningBrand('');
          setMorningCategory('');
          // Reset the editing state
          setEditingProductId(null);
          setMorningEditing(false);
          getMorningProducts();
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
      fetch(` https://skinsync-mgydyyeela-no.a.run.app/productShelf/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            getMorningProducts();
          } else {
            console.error('Failed to delete product');
          }
          setMorningName('');
          setMorningBrand('');
          setMorningCategory('');
          setClickCount(0);
          setMorningEditing(false);
        });
    }
  };

  // EDIT
  const handleMorningEdit = (productId) => {
    setMorningName('');
    setMorningBrand('');
    setMorningCategory('');

    if (editingProductId === productId) {
      setEditingProductId(null);
      setMorningEditing(false);
    } else {
      const product = morningProducts.find((prod) => prod._id === productId);
      if (product) {
        setMorningName(product.name);
        setMorningBrand(product.brand);
        setMorningCategory(product.category);
        setEditingProductId(productId);
        setMorningEditing(true); // Set morningEditing to true
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

  const morningProductCount = morningProducts.length;

  return (
    <div className="bodyshelves">
      <img src={Shelfblob} className="Shelfblob" alt="Descriptive text" />
      <div>
        <Slide>
          <h1 className="shelvestitle">Product Shelves</h1>
        </Slide>
        <h2>Morning Shelf</h2>
        <ReactSimplyCarousel
          activeSlideIndex={activeSlideIndex}
          onRequestChange={setActiveSlideIndex}
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
              textAlign: 'center',
              width: 30
            },
            children: <span>{'<'}</span>
          }}
          responsiveProps={[
            {
              itemsToShow: 1,
              itemsToScroll: 1,
              minWidth: 200
            }
          ]}
          speed={400}
          easing="linear">
          {morningProducts.map((product) => (
            <div className="carousel-item" key={product._id}>
              <ProductImage
                className="product-image"
                src={getImagePath(product.category)}
                alt={product.category}
                onClick={() => handleMorningEdit(product._id)} />

              <div className="productsnameandbrand">
                <h5>{product.name} : {product.brand}</h5>
              </div>
            </div>
          ))}
        </ReactSimplyCarousel>
        <p>{morningProductCount} products</p>

        <form className="form-wrapper" onSubmit={handleSubmitMorningRoutine}>
          <fieldset className="fieldset"><legend>{morningEditing ? 'Edit' : 'Add to '} Morning shelf</legend>
            <div>
              <label className="labelusage" htmlFor="morningName">Name:</label>
              <input
                type="text"
                placeholder="product name"
                id="morningName"
                value={morningName}
                onChange={(e) => setMorningName(e.target.value)}
                required />
            </div>
            <div>
              <label className="labelusage" htmlFor="morningBrand">Brand:</label>
              <input
                type="text"
                placeholder="brand name"
                id="morningBrand"
                value={morningBrand}
                onChange={(e) => setMorningBrand(e.target.value)} />
            </div>
            <div>
              <label className="labelusage" htmlFor="morningCategory">Category:</label>
              <select
                className="select"
                id="morningCategory"
                value={morningCategory}
                onChange={(e) => setMorningCategory(e.target.value)}
                required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <AddProductButton
              className="productbutton"
              type="submit"
              onClick={(event) => {
                if (morningName && morningCategory) {
                  handleConfetti();
                  handleSubmitMorningRoutine(event);
                }
              }}>
              {morningEditing ? 'Save change' : 'Put on shelf'}
            </AddProductButton>
            <DeleteProductButton
              className="productbutton"
              type="button"
              onClick={() => handleDeleteProduct(editingProductId)}
              clicked={clickCount > 0}
              ref={buttonRef}
              isVisible={morningEditing}>
              {clickCount === 0 ? 'Delete' : 'Delete product?'}
            </DeleteProductButton>
          </fieldset>
          <UsageLink className="logusagebutton" to="/productShelf/logUsage">Log my products usage</UsageLink>
        </form>
      </div>
    </div>
  );
};

export default MorningShelf;