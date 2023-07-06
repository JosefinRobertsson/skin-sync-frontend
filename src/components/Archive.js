/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ArchivePopUp from './ArchivePopUp.js';
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

const Archive = ({
  getNightProducts,
  getMorningProducts,
  archivedProducts,
  fetchSkincareProducts,
  loading
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelection = (productId) => {
    const clickedProduct = archivedProducts.find((prod) => prod._id === productId);
    setSelectedProduct(clickedProduct);
  };

  const handleKeyPress = (event, ID) => {
    if (event.key === 'Enter') {
      handleProductSelection(ID);
    }
  };

  const handlePopUpClose = () => {
    fetchSkincareProducts();
    setSelectedProduct(null);
    getNightProducts();
    getMorningProducts();
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const archivedProductsCount = archivedProducts.filter(
    (product) => product.archived === true
  ).length;

  return (
    <div className="shelvesWrapper">
      <h1>Archive</h1>
      <div className="productShelf archived-shelf">
        {archivedProducts
          .filter((product) => product.archived === true)
          .sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt))
          .map((product) => (
            <div className="product-container" key={uuidv4()}>
              <div
                className={`product-item ${product.routine === 'morning' ? 'product-item' : 'nightProduct'}`}
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
      <p>{archivedProductsCount} products</p>
      {selectedProduct && (
        <ArchivePopUp
          product={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          getImagePath={getImagePath}
          archivedProducts={archivedProducts}
          onClose={handlePopUpClose} />
      )}
    </div>
  );
};

export default Archive;