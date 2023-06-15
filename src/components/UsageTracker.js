/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toggle from 'react-toggle';
import './UsageTracker.css';
import Slider from 'react-slick';
import '../styles/slick.css';
import '../styles/slick-theme.css';
import '../styles/slick-docs.css';
import { Zoom } from 'react-awesome-reveal';
import { ShelfLink } from '../styles/StyledLinks';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
import 'react-toggle/style.css'
import sunscreenImage from '../images/sunscreen.png';
import otherImage from '../images/other.png';
import defaultImage from '../images/default.png';

const settings = {
  dots: true,
  arrows: true,
  swipe: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 2000,
  centerMode: true,
  fade: false
};

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

const UsageTracker = () => {
  const [morningProducts, setMorningProducts] = useState([]);
  const [nightProducts, setNightProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // const [lastVisited, setLastVisited] = useState(null);
  axios.defaults.baseURL = 'http://localhost:8080';

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

        const morningProducts = morningResponse.data.response;
        const nightProducts = nightResponse.data.response;

        /* Maps through both arrays, compares todays date with last usage date if usedToday is true,
         and updates usedToday to false if last usage date is not today.
         Saves in promises before sending to backend
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0];
        console.log('now', now);
        const testArray = [];
        morningProducts.forEach((product) => {
          if (product.usedToday) {
            const lastUsageDateStr = product.usageHistory[product.usageHistory.length - 1];
            console.log('lastUsageDateStr', lastUsageDateStr)
            const lastUsageDate = lastUsageDateStr ? new Date(lastUsageDateStr) : null;
            const lastUsageDateFormatted = lastUsageDate && lastUsageDate instanceof Date ?
            lastUsageDate.toISOString().split('T')[0] : null;

            if (lastUsageDateFormatted !== todayDate) {
              console.log('whats happening')
              // product = { productId: product._id, usedToday: false }
              testArray.push({ productId: product._id, usedToday: false })
            }
          }
        });
        try {
          await axios.put('/productShelf/usageReset', {
            productIds: testArray
          }, config);
        } catch (error) {
          console.error(error);
          setError('Failed to fetch skincare products');
        }
        console.log('testArray', testArray)
        try {
          // Promise.all waits for all promises to resolve, then triggers them all concurrently
          // await Promise.all(morningPromises);
        } catch (e) {
          console.error(e);
          setError('Failed to fetch skincare products');
        }

        const nightPromises = nightProducts.map(async (product) => {
          if (product.usedToday) {
            const lastUsageDateStr = product.usageHistory[product.usageHistory.length - 1];
            const lastUsageDate = lastUsageDateStr ? new Date(lastUsageDateStr) : null;

            const lastUsageDateFormatted = lastUsageDate && lastUsageDate instanceof Date ?
            lastUsageDate.toISOString().split('T')[0] : null;

            if (lastUsageDateFormatted !== todayDate) {
              try {
                await axios.put('/productShelf/usageReset', {
                  productId: product._id,
                  usedToday: false
                }, config);
              } catch (error) {
                console.error(error);
                setError('Failed to fetch skincare products');
              }
            }
          }
          return Promise.resolve();
        });
        try {
          await Promise.all(nightPromises);
        } catch (e) {
          console.error(e);
          setError('Failed to fetch skincare products');
        } */
        setMorningProducts(morningProducts);
        setNightProducts(nightProducts);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch skincare products');
      }
    };
    fetchSkincareProducts();
  }, []);

  // Change usage status of all products in a routine
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
              const response = await axios.post('/productShelf/toggleAllUsage', { productId: product._id,
                usedToday: false,
                usageHistory: [...product.usageHistory] }, config);
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
      console.log('routine updated');
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
      /*
      const updatedUsedToday = !usedToday;
      const updatedUsageHistory = [...usageHistory];
      if (updatedUsedToday) {
        updatedUsageHistory.push(new Date());
      } else {
        updatedUsageHistory.pop();
        console.log('popped:', updatedUsageHistory);
        console.log('length:', updatedUsageHistory.length);
      }
      */
      const response = await axios.post(
        '/productShelf/logUsage',
        {
          productId,
          usedToday: !usedToday
        },
        config
      );

      if (response.data.success) {
        console.log('response:', response.data.response);
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

  return (
    <div className="UsageTracker">
      <Zoom>
        <h2>Morning Routine</h2>
      </Zoom>
      <div>
        <ShelfLink to="/productShelf">Edit routine</ShelfLink>
      </div>
      <Slider {...settings}>
        {morningProducts.map((product) => (
          <div className="productItem" key={product._id}>
            <img src={getImagePath(product.category)} alt={product.category} />
            <p>{product.name}</p>
            <p>{product.brand}</p>
            <div>
              <label htmlFor={`toggle-${product._id}`}>
                Used today:
                <Toggle
                  id={`toggle-${product._id}`}
                  checked={product.usedToday}
                  onChange={() => handleUsageChange(product)} />
              </label>
            </div>
          </div>
        ))}
      </Slider>
      <Toggle
        id="toggle-all-morning"
        checked={morningProducts.every((product) => product.usedToday)}
        onChange={(e) => {
          const action = e.target.checked ? 'toggleOn' : 'toggleOff';
          toggleAllUsage(action, 'morning', setMorningProducts);
        }} />
      <Zoom>
        <h2>Night Routine</h2>
      </Zoom>
      <div>
        <ShelfLink to="/productShelf">Edit routine</ShelfLink>
      </div>
      <Slider {...settings}>
        {nightProducts.map((product) => (
          <div className="productItem" key={product._id}>
            <img src={getImagePath(product.category)} alt={product.category} />
            <p>{product.name}</p>
            <p>{product.brand}</p>
            <div>
              <label htmlFor={`toggle-${product._id}`}>
                Used today:
                <Toggle
                  id={`toggle-${product._id}`}
                  checked={product.usedToday}
                  onChange={() => handleUsageChange(product)} />
              </label>
            </div>
          </div>
        ))}
      </Slider>
      <Toggle
        id="toggle-all-night"
        checked={nightProducts.every((product) => product.usedToday)}
        onChange={(e) => {
          const action = e.target.checked ? 'toggleOn' : 'toggleOff';
          toggleAllUsage(action, 'night', setNightProducts);
        }} />

    </div>
  );
};

export default UsageTracker;

/* <Toggle
        id="toggle-all-night"
        checked={morningProducts.every((product) => product.usedToday)}
        onChange={() => toggleAllUsage()} />
        */