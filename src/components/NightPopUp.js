/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BaseButton, DeleteProductButton, SaveButton } from '../styles/StyledButtons';
import StarIconEmpty from '../images/star-empty.png';
import StarIconFilled from '../images/star-full.png';
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
  z-index: 25;
`;

const ProductWindow = styled.div`
  width: 270px;
  height: fit-content;
  border-radius: 1rem;
  padding: 0.5rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(5,19,6,0.6);

  @media screen and (min-width: 318px) {
    width: 300px;
  }
  `;

const ImgContainer = styled.div`
position: relative;
${(props) => props.isFavorite
    && `
&::before {
    content: '';
    height: 20%;
  left: -10%;
  aspect-ratio: 1/1;
  background-image: url(${StarIconFilled});
  background-size: 100% 100%;
  position: absolute;
  z-index: 999;
}
`}
img {
height: 60px;
filter: invert(0.95);
}
@media screen and (min-width: 400px) {
  img {
  height: 100px;
  }
}
`;

const NightPopUp = ({
  product,
  setSelectedProduct, getImagePath, categories, onClose
}) => {
  const [nightName, setNightName] = useState(product.name);
  const [nightBrand, setNightBrand] = useState(product.brand);
  const [nightCategory, setNightCategory] = useState(product.category);
  const [archived, setArchived] = useState(product.archived);
  const [favorite, setFavorite] = useState(product.favorite);
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
        category: nightCategory,
        archived,
        archivedAt: new Date(),
        favorite
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
          console.error('Failed to submit product update');
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

  // Keyboard Archived
  const handleCheckboxKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setArchived(!archived);
    }
  };
  // Keyboard Favorite
  const handleFavoriteCheckbox = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setFavorite(!favorite);
    }
  };

  const handleCheckboxFocus = (event) => {
    const checkbox = event.target;
    const label = checkbox.nextElementSibling;
    label.classList.add('focused');
    label.style.background = '#ea9350';
  };

  const handleCheckboxBlur = (event) => {
    const checkbox = event.target;
    const label = checkbox.nextElementSibling;
    label.classList.remove('focused');
    label.style.background = '';
    label.style.color = '';
  };

  const handleFavFocus = (event) => {
    const checkbox = event.target;
    const label = checkbox.nextElementSibling;
    label.classList.add('focused');
    label.style.background = 'rgb(113, 210, 110)';
  };

  const handleFavBlur = (event) => {
    const checkbox = event.target;
    const label = checkbox.nextElementSibling;
    label.classList.remove('focused');
    label.style.background = '';
    label.style.color = '';
  };

  return (
    <Wrapper>
      <ProductWindow>
        <ImgContainer isFavorite={product && product.favorite}>
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
                <option value="" disabled selected>Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="checkbox"
                onFocus={handleCheckboxFocus}
                onBlur={handleCheckboxBlur}
                id={`archived-${product._id}`}
                className="archived-checkbox"
                checked={archived}
                onChange={() => setArchived(!archived)}
                onKeyDown={(event) => handleCheckboxKeyDown(event)}
                tabIndex={0} />
              <label
                id="archive-label-night"
                htmlFor={`archived-${product._id}`}
                className={archived ? 'archived' : ''}>
                {!archived ? 'Archive product? Yes' : 'Product archived. Undo'}
              </label>
            </div>
            <div className="popUpButtonContainer">
              <div>
                <input
                  type="checkbox"
                  id="favorite-checkbox"
                  checked={favorite}
                  onFocus={handleFavFocus}
                  onBlur={handleFavBlur}
                  onChange={() => setFavorite(!favorite)}
                  onKeyDown={(event) => handleFavoriteCheckbox(event)}
                  tabIndex={0} />
                <label
                  id="favorite-label-night"
                  htmlFor="favorite-checkbox"
                  className={favorite ? 'favorite-star' : 'neutral-star'}>
                  {favorite ? (
                    <img id="StarIconFull" src={StarIconFilled} height="30px" alt="star checked" />
                  ) : (
                    <img id="StarIcon" src={StarIconEmpty} height="30px" alt="star unchecked" />
                  )}
                </label>
                <SaveButton
                  className="productbutton"
                  type="submit">
                Save change
                </SaveButton>
              </div>
              <div>
                <DeleteProductButton
                  type="button"
                  onClick={() => handleDeleteProduct(product._id)}
                  clicked={clickCount > 0}
                  ref={buttonRef}>
                  {clickCount === 0 ? 'Delete' : 'Delete product?'}
                </DeleteProductButton>
              </div>
            </div>
          </fieldset>
        </form>
        <BaseButton onClick={handleBackButtonClick}>Back</BaseButton>
      </ProductWindow>
    </Wrapper>
  );
};

export default NightPopUp;