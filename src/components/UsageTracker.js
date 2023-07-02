/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toggle from 'react-toggle';
import ReactSimplyCarousel from 'react-simply-carousel';
import { ShelfLink } from '../styles/StyledLinks';
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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeSlideIndexNight, setActiveSlideIndexNight] = useState(0);
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
        console.log('initialProducts', initialProducts);
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

  const morningProductsCount = morningProducts.length;
  const nightProductsCount = nightProducts.length;

  return (
    <div className="usageTrackerWrapper">
      <h1 className="usagetitle">Skincare Log</h1>
      <h2>Morning Routine</h2>

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
            lineHeight: 1,
            textAlign: 'center',
            width: 30
          },
          children: <span>{'<'}</span>
        }}
        responsiveProps={[
          {
            itemsToShow: 1,
            itemsToScroll: 1,
            minWidth: 768
          }
        ]}
        speed={400}
        easing="linear">
        {morningProducts.map((product) => (
          <div className="productItem" key={product._id} style={{ width: 250, height: 240, background: '#FFF5E9' }}>
            <img src={getImagePath(product.category)} alt={product.category} />

            <div className="productsnameandbrand">
              <span>{product.name}</span>
              <span>{product.brand}</span>
            </div>
            <div>
              <label htmlFor={`toggle-${product._id}`}>
                Used today:

                <Toggle
                  icons={false}
                  className="my-toggle"
                  id={`toggle-${product._id}`}
                  checked={product.usedToday}
                  onChange={() => handleUsageChange(product)} />
              </label>
            </div>
          </div>
        ))}
      </ReactSimplyCarousel>
      <div className="Selectall">
        <h5> Select all {morningProductsCount}</h5>
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

      <div className="editbutton">
        <ShelfLink to="/productShelf">Go to shelf</ShelfLink>
      </div>

      <h2>Night Routine</h2>

      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndexNight}
        onRequestChange={setActiveSlideIndexNight}
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
            lineHeight: 1,
            textAlign: 'center',
            width: 30
          },
          children: <span>{'<'}</span>
        }}
        responsiveProps={[
          {
            itemsToShow: 1,
            itemsToScroll: 1,
            minWidth: 768
          }
        ]}
        speed={400}
        easing="linear">
        {nightProducts.map((product) => (
          <div className="productItem night" key={product._id} style={{ width: 250, height: 240, background: '#FFF5E9' }}>
            <img src={getImagePath(product.category)} alt={product.category} />
            <div className="productsnameandbrand">
              <h5>{product.name} : {product.brand}</h5>
            </div>
            <div>
              <label htmlFor={`toggle-${product._id}`}>
                Used today:
                <Toggle
                  icons={false}
                  className="my-toggle"
                  id={`toggle-${product._id}`}
                  checked={product.usedToday}
                  onChange={() => handleUsageChange(product)} />
              </label>
            </div>
          </div>
        ))}
      </ReactSimplyCarousel>
      <div className="Selectall">
        <h5> Select all {nightProductsCount}</h5>
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
      <div className="editbutton">
        <ShelfLink to="/productShelf">Go to shelf</ShelfLink>
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