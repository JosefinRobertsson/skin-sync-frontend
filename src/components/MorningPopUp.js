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
  background: radial-gradient(circle at 15% 35%, rgba(255,220,203,1) 0%, rgb(238, 133, 85) 13%, rgb(113, 210, 110) 95%);
  z-index: 90;
  `;

const ImgContainer = styled.div`
img {
height: 100px;
filter: invert(1);
}
`;

const MorningPopUp = ({
  product,
  setSelectedProduct, getImagePath, categories, onClose
}) => {
  const [morningName, setMorningName] = useState(product.name);
  const [morningBrand, setMorningBrand] = useState(product.brand);
  const [morningCategory, setMorningCategory] = useState(product.category);
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
        name: morningName.charAt(0).toUpperCase() + morningName.slice(1).toLowerCase(),
        brand: morningBrand.charAt(0).toUpperCase() + morningBrand.slice(1).toLowerCase(),
        category: morningCategory
      })
    };

    fetch(`http://localhost:8080/productShelf/${product._id}`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMorningName('');
          setMorningBrand('');
          setMorningCategory('');
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
            setMorningName('');
            setMorningBrand('');
            setMorningCategory('');
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
      if (id === 'morningName') {
        setMorningName(truncatedValue);
      } else if (id === 'morningBrand') {
        setMorningBrand(truncatedValue);
      }
    }
  };

  return (
    <Wrapper>
      <ProductWindow>
        <ImgContainer>
          <img src={getImagePath(product.category)} alt="product icon" />
        </ImgContainer>
        <div className="productText">
          <h3>{product.name}</h3>
          {product.brand.length > 0 && (<h4>{product.brand}</h4>)}
        </div>
        <form className="shelf-form popup-form" onSubmit={handleProductSave}>
          <fieldset>
            <legend>Edit product</legend>
            <div>
              <label htmlFor="morningName">
                  Name:
              </label>
              <input
                type="text"
                placeholder="product name"
                id="morningName"
                value={morningName}
                onChange={handleInputChange}
                required />
            </div>
            <div>
              <label className="labelusage" htmlFor="morningBrand">
                  Brand:
              </label>
              <input
                type="text"
                placeholder="brand name"
                id="morningBrand"
                value={morningBrand}
                onChange={handleInputChange} />
            </div>
            <div>
              <label className="labelusage" htmlFor="morningCategory">
                  Category:
              </label>
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

export default MorningPopUp;