/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BaseButton, DeleteProductButton, SaveButton, BackButton } from '../styles/StyledButtons';
import './compCSS/ShelfPopUp.css';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

const ProductWindow = styled.div`
  width:300px;
  height: fit-content;
  border-radius: 1rem;
  padding: 0.5rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(5,19,6,0.6);
  `;

const ImgContainer = styled.div`
img {
    height: 100px;
filter: invert(0.95);
}
`;

const NightPopUp = ({
  product,
  setSelectedProduct, getImagePath, categories, onClose
}) => {
  const [nightName, setNightName] = useState(product.name);
  const [nightBrand, setNightBrand] = useState(product.brand);
  const [nightCategory, setNightCategory] = useState(product.category);
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef(null);

  const handleBackButtonClick = () => {
    setSelectedProduct(null);
  };

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

  const handleProductSave = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      body: JSON.stringify({
        name: nightName.charAt(0).toUpperCase() + nightName.slice(1).toLowerCase(),
        brand: nightBrand.charAt(0).toUpperCase() + nightBrand.slice(1).toLowerCase(),
        category: nightCategory
      })
    };

    fetch(`http://localhost:8080/productShelf/${product._id}`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNightName('');
          setNightBrand('');
          setNightCategory('');
        } else {
          console.error('Failed to submit Skincare Product');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        setSelectedProduct(null);
        onClose();
      });
  };

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
            setNightName('');
            setNightBrand('');
            setNightCategory('');
            setClickCount(0);
            setSelectedProduct(null);
            onClose();
          } else {
            console.error('Failed to delete product');
          }
        });
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

  return (
    <Wrapper>
      <ProductWindow>
        <ImgContainer>
          <img src={getImagePath(product.category)} alt="product icon" />
        </ImgContainer>
        <div className="productText night-edit">
          <h3>{product.name}</h3>
          {product.brand.length > 0 && (<h4>{product.brand}</h4>)}
        </div>
        <form className="shelf-form popup-form night-edit-form" onSubmit={handleProductSave}>
          <fieldset>
            <legend>Edit product</legend>
            <div>
              <label htmlFor="nightName">
                  Name:
              </label>
              <input
                type="text"
                placeholder="product name"
                id="nightName"
                value={nightName}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <label className="labelusage" htmlFor="nightBrand">
                  Brand:
              </label>
              <input
                type="text"
                placeholder="brand name"
                id="nightBrand"
                value={nightBrand}
                onChange={handleInputChange} />
            </div>
            <div>
              <label className="labelusage" htmlFor="nightCategory">
                  Category:
              </label>
              <select
                className="select"
                id="nightCategory"
                value={nightCategory}
                onChange={(e) => setNightCategory(e.target.value)}
                required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="popUpButtonContainer">
              <SaveButton
                className="productbutton"
                type="submit">
                Save change
              </SaveButton>
              <DeleteProductButton
                type="button"
                onClick={() => handleDeleteProduct(product._id)}
                clicked={clickCount > 0}
                ref={buttonRef}>
                {clickCount === 0 ? 'Delete' : 'Delete product?'}
              </DeleteProductButton>
              <BackButton
                type="button"
                onClick={handleBackButtonClick}>
                Cancel
              </BackButton>
            </div>
          </fieldset>
        </form>
        <BaseButton onClick={handleBackButtonClick}>Back</BaseButton>
      </ProductWindow>
    </Wrapper>
  );
};

export default NightPopUp;