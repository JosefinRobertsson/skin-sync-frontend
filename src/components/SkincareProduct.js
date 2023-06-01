/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';

function SkincareProduct() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    const accessToken = localStorage.getItem('accessToken');
    fetch('http://localhost:8080/skincareProduct', {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.response);
      });
  };

  useEffect(() => {
    getProducts(); // display the products
  }, []);

  const handleSubmitProduct = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        name,
        brand,
      }),
    };

    fetch('http://localhost:8080/skincareProduct', options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Skincare product submitted successfully');
          setName('');
          setBrand('');
          getProducts(); // Refresh products list after adding a new product
        } else {
          console.error('Failed to submit Skincare Product');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  const handleDeleteProduct = (productId) => {
    const accessToken = localStorage.getItem('accessToken');
    fetch(`http://localhost:8080/skincareProduct/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('Product deleted successfully');
          getProducts(); // Refresh products list after deleting a product
        } else {
          console.error('Failed to delete product');
        }
      });
  };

  return (
    <div>
      <h1>Products shelf</h1>
      <form onSubmit={handleSubmitProduct}>
        <div>
          <label htmlFor="name">Name of the product:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="brand">Brand of the product:</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <button type="submit">Submit Product</button>
      </form>
      <h2>Added Products</h2>
      {products.map((product) => (
        <div key={product._id}>
          <p>
            Product Type:
            {product.name}

            brand name:
            {' '}
            {product.brand}

          </p>
          <button type="button" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default SkincareProduct;
