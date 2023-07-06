/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toggle from 'react-toggle';
import { v4 as uuidv4 } from 'uuid';
import 'react-toggle/style.css'
import './compCSS/UsageTracker.css';
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

const UsageTracker = () => {
  const [morningProducts, setMorningProducts] = useState([]);
  const [nightProducts, setNightProducts] = useState([]);
  // const [initialProducts, setInitialProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // const [lastVisited, setLastVisited] = useState(null);
  axios.defaults.baseURL = 'http://localhost:8080';
  // axios.defaults.baseURL = ' https://skinsync-mgydyyeela-no.a.run.app';

  useEffect(() => {
    const fetchSkincareProducts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('No access token found');
          return;
        }
        const config = {
          headers: {
            Authorization: accessToken
          }
        };

        // Fetch all products from morning and night shelves
        const morningResponse = await axios.get('/productShelf/morning', config);
        const nightResponse = await axios.get('/productShelf/night', config);
        if (!morningResponse.data.success || !nightResponse.data.success) {
          throw new Error('Failed to fetch skincare products');
        }
        // make one array of all products
        const initialProducts = [...morningResponse.data.response, ...nightResponse.data.response];
        // eslint-disable-next-line no-use-before-define
        (isNewDate(initialProducts))
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch skincare products');
      }
    };
    fetchSkincareProducts();
  }, []);
  // End fetchSkincareProducts

  const isNewDate = async (initialProducts) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }
      const config = {
        headers: {
          Authorization: accessToken
        }
      };

      const now = new Date();
      const todayDate = now.toISOString().split('T')[0];

      // collect the products that have been reset in an array
      // so we can update them in the database too
      const resetProducts = [];

      initialProducts.forEach((product) => {
        if (product.usedToday) {
          const lastUsageDateStr = product.usageHistory[product.usageHistory.length - 1];
          const lastUsageDate = lastUsageDateStr ? new Date(lastUsageDateStr) : null;
          const lastUsageDateFormatted = lastUsageDate && lastUsageDate instanceof Date
            ? lastUsageDate.toISOString().split('T')[0] : null;

          if (lastUsageDateFormatted !== todayDate) {
            product.usedToday = false;
            resetProducts.push(product);
          }
        }
      });

      resetProducts.filter(async (product) => {
        try {
          await axios.post(
            '/productShelf/usageReset',
            {
              productId: product._id
            },
            config
          );
        } catch (error) {
          console.error(error);
          setError('Failed to send reset request');
        }
      })
    } catch (e) {
      console.error(e);
      setError('Failed to reset usedToday');
    }
    // eslint-disable-next-line no-use-before-define
    splitProducts(initialProducts);
  };

  // Split products into morning and night products
  const splitProducts = (initialProducts) => {
    const morningArray = [];
    const nightArray = [];
    initialProducts.forEach((product) => {
      if (product.routine === 'morning') {
        morningArray.push(product);
      } else if (product.routine === 'night') {
        nightArray.push(product);
      }
    })
    setMorningProducts(morningArray);
    setNightProducts(nightArray);
  };

  // Change usage status of all products in a routine at once
  const toggleAllUsage = async (action, productType, setProducts) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }
      const config = {
        headers: {
          Authorization: accessToken
        }
      };

      let productsToUpdate;
      if (productType === 'morning') {
        productsToUpdate = morningProducts;
        setProducts = setMorningProducts;
      } else if (productType === 'night') {
        productsToUpdate = nightProducts;
        setProducts = setNightProducts;
      } else {
        setError('Invalid product type');
        return;
      }

      const updatedProducts = await Promise.all(
        productsToUpdate.map(async (product) => {
          if (action === 'toggleOn' && !product.usedToday) {
            // Set usedToday to true and push the current date to usageHistory
            try {
              const response = await axios.post('/productShelf/toggleAllUsage', {
                productId: product._id,
                usedToday: true,
                usageHistory: [...product.usageHistory, new Date()]
              }, config);
              return response.data.response;
            } catch (error) {
              console.error(error);
              setError('Failed to toggle on all morning products');
            }
          } else if (action === 'toggleOff' && product.usedToday) {
            // Set usedToday to false and pop the last date from usageHistory
            product.usageHistory.pop();
            try {
              const response = await axios.post('/productShelf/toggleAllUsage', {
                productId: product._id,
                usedToday: false,
                usageHistory: [...product.usageHistory]
              }, config);
              return response.data.response;
            } catch (error) {
              console.error(error);
              setError('Failed to toggle off all morning products');
            }
          } else {
            return product;
          }
        })
      );

      const updatedProductList = productsToUpdate.map(
        (product) => updatedProducts.find(
          (updatedProduct) => updatedProduct._id === product._id
        ) || product
      );
      setProducts(updatedProductList);
    } catch (error) {
      console.error(error);
      setError(`Failed to toggle usage for all ${productType} products`);
    } finally {
      setIsLoading(false);
    }
  };

  // Change usage status of a single product
  const handleUsageChange = async (product) => {
    try {
      const { _id: productId, usedToday } = product;
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }
      const config = {
        headers: {
          Authorization: accessToken
        }
      };

      const response = await axios.post(
        '/productShelf/logUsage',
        {
          productId,
          usedToday: !usedToday
        },
        config
      );

      if (response.data.success) {
        setMorningProducts(
          (prevMorningProducts) => prevMorningProducts.map((product) => (product._id === productId
            ? { ...product, usedToday: !usedToday }
            : product))
        );

        setNightProducts(
          (prevNightProducts) => prevNightProducts.map((product) => (product._id === productId
            ? { ...product, usedToday: !usedToday }
            : product))
        );
      }
    } catch (e) {
      console.error(e);
      console.error('product category:', e.response?.data?.response?.category || 'Unknown');
    }
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  const handleKeyPress = (event, product) => {
    if (event.key === 'Enter') {
      handleUsageChange(product);
    }
  };

  const morningProductsCount = morningProducts.length;
  const nightProductsCount = nightProducts.length;

  return (
    <div className="usageTrackerWrapper">
      <h1>Skincare Log</h1>
      <div className="routine-container">
        <h2>Morning Routine</h2>
        <div className="usage-desc">
          <p>Click the products you used today to save them to your log.
            You can check all at once with the toggle, and click a product again to uncheck it.
          </p>
        </div>
        <div className="productShelf morning">
          {morningProducts
            .filter((product) => !product.archived)
            .map((product) => (
              <div className="product-container" key={uuidv4()}>
                <div
                  className={`routine-item ${product.usedToday ? 'active' : ''}`}
                  key={product._id}
                  onClick={() => handleUsageChange(product)}
                  onKeyDown={(event) => handleKeyPress(event, product)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked>
                  <img src={getImagePath(product.category)} alt={product.category} />

                  <div className="productsnameandbrand">
                    <h5>{product.name}</h5>
                    <h5>{product.brand}</h5>
                  </div>

                  <input
                    type="checkbox"
                    id={`checkbox-${product._id}`}
                    checked={product.usedToday}
                    onChange={() => { }} />
                  <label htmlFor={`checkbox-${product._id}`} />
                </div>
              </div>
            ))}
        </div>
        <div className="Selectall">
          <p> Select all {morningProductsCount}</p>
          <Toggle
            icons={false}
            className="my-toggle"
            id="toggle-all-morning"
            checked={morningProducts.every((product) => product.usedToday)}
            onChange={(e) => {
              const action = e.target.checked ? 'toggleOn' : 'toggleOff';
              toggleAllUsage(action, 'morning', setMorningProducts);
            }} />
        </div>
      </div>
      <div className="routine-container">

        <h2>Night Routine</h2>
        <div className="productShelf night">
          {nightProducts
            .filter((product) => !product.archived)
            .map((product) => (
              <div className="product-container" key={uuidv4()}>
                <div
                  className={`routine-item night-routine ${product.usedToday ? 'active' : ''}`}
                  key={product._id}
                  onClick={() => handleUsageChange(product)}
                  onKeyDown={(event) => handleKeyPress(event, product)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked>
                  <img src={getImagePath(product.category)} alt={product.category} />

                  <div className="productsnameandbrand">
                    <h5 className="night-routine-h5">{product.name}</h5>
                    <h5 className="night-routine-h5">{product.brand}</h5>
                  </div>

                  <input
                    type="checkbox"
                    id={`checkbox-${product._id}`}
                    checked={product.usedToday}
                    onChange={() => { }} />
                  <label htmlFor={`checkbox-${product._id}`} />
                </div>
              </div>
            ))}
        </div>
        <div className="Selectall">
          <p> Select all {nightProductsCount}</p>
          <Toggle
            icons={false}
            className="my-toggle"
            id="toggle-all-night"
            checked={nightProducts.every((product) => product.usedToday)}
            onChange={(e) => {
              const action = e.target.checked ? 'toggleOn' : 'toggleOff';
              toggleAllUsage(action, 'night', setNightProducts);
            }} />
        </div>
      </div>
    </div>
  );
};

export default UsageTracker;

/* <Toggle
        id="toggle-all-night"
        checked={morningProducts.every((product) => product.usedToday)}
        onChange={() => toggleAllUsage()} />
        */