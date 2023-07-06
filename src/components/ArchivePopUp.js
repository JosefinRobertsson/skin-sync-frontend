/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BaseButton, DeleteProductButton, SaveButton, BackButton } from '../styles/StyledButtons';

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

const ArchivePopUp = ({
  product,
  setSelectedProduct, getImagePath, onClose
}) => {
  const [archived, setArchived] = useState(product.archived);
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
        archived
      })
    };

    fetch(`http://localhost:8080/productShelf/${product._id}`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('removed from archive');
          onClose();
        } else {
          console.error('Failed to remove from archive');
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
            console.log('Product deleted');
            setClickCount(0);
            setSelectedProduct(null);
            onClose();
          } else {
            console.error('Failed to delete product');
          }
        });
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
            <legend>Remove from archive</legend>
            <input
              type="checkbox"
              id={`archived-${product._id}`}
              checked={archived}
              onChange={() => setArchived(!archived)} />
            <label
              id="archive-label-night"
              htmlFor={`archived-${product._id}`}
              className={archived ? 'archived' : ''}>
              {!archived ? 'Archive product? Yes' : 'Product archived. Undo'}
            </label>
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
  )
}

export default ArchivePopUp;