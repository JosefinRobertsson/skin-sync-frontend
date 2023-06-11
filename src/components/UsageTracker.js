/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import './UsageTracker.css';
import Slider from 'react-slick';
import '../styles/slick.css';
import '../styles/slick-theme.css';
import '../styles/slick-docs.css';
import { ShelfLink } from '../styles/StyledLinks';
import cleanserImage from '../images/cleanser.png';
import moisturizerImage from '../images/moisturizer.png';
import serumImage from '../images/serum.png';
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
  centerMode: true
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

        // Fetch all products
        const morningResponse = await axios.get('/productShelf/morning', config);
        const nightResponse = await axios.get('/productShelf/night', config);
        if (!morningResponse.data.success || !nightResponse.data.success) {
          throw new Error('Failed to fetch skincare products');
        }

        const morningProducts = morningResponse.data.response;
        const nightProducts = nightResponse.data.response;

        // Check and reset usedToday status if new day
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0];

        morningProducts.forEach(async (product) => {
          if (product.usedToday) {
            // compare last usage date with today's date
            const lastUsageDate = product.usageHistory[product.usageHistory.length - 1];
            const lastUsageDateStr = lastUsageDate && lastUsageDate instanceof Date ? lastUsageDate.toISOString().split('T')[0] : null;

            if (lastUsageDateStr !== todayDate) {
              // Send request to reset usedToday
              await axios.post('/productShelf/logUsage', {
                productId: product._id,
                usedToday: false
              }, config);
            }
          }
        });

        nightProducts.forEach(async (product) => {
          if (product.usedToday) {
            const lastUsageDate = product.usageHistory[product.usageHistory.length - 1];
            const lastUsageDateStr = lastUsageDate && lastUsageDate instanceof Date ? lastUsageDate.toISOString().split('T')[0] : null;

            if (lastUsageDateStr !== todayDate) {
              await axios.post('/productShelf/logUsage', {
                productId: product._id,
                usedToday: false
              }, config);
            }
          }
        });

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

  /*
  // Change usage status of all products in a routine
  const toggleAllUsage = async (action) => {
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

      const toggleProducts = async (products) => {
        const updatedProducts = [];

        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          let updatedProduct;

          if (action === 'toggleOn' && !product.usedToday) {
            // Set usedToday to true and push the current date to usageHistory
            updatedProduct = {
              ...product,
              usedToday: true,
              usageHistory: [...product.usageHistory, new Date()]
            };
          } else if (action === 'toggleOff' && product.usedToday) {
            // Set usedToday to false and pop the last date from usageHistory
            const updatedUsageHistory = [...product.usageHistory];
            updatedUsageHistory.pop();

            updatedProduct = {
              ...product,
              usedToday: false,
              usageHistory: updatedUsageHistory
            };
          } else {
            updatedProduct = product; // No changes needed for this product
          }

          // Send request to update the product
          const response = await axios.post('/productShelf/toggleAllUsage', updatedProduct, config);
          updatedProducts.push(response.data.response);
        }

        return updatedProducts;
      };

      const updatedMorningProducts = await toggleProducts(morningProducts);
      const updatedNightProducts = await toggleProducts(nightProducts);

      setMorningProducts(updatedMorningProducts);
      setNightProducts(updatedNightProducts);
    } catch (error) {
      console.error(error);
      setError('Failed to toggle usage for all products');
    }
  };
 */

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
      <h2>Morning Routine</h2>
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

      <h2>Night Routine</h2>
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
    </div>
  );
};

export default UsageTracker;

/* <Toggle
        id="toggle-all-night"
        checked={morningProducts.every((product) => product.usedToday)}
        onChange={() => toggleAllUsage()} />
        */