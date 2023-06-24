import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vh;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProductWindow = styled.div`
  width: 200px;
  height: 220px;
  border-radius: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${(props) => (props.routine === 'morning' ? '#FCD2B3' : '#1d0d48')};
  color: ${(props) => (props.routine === 'morning' ? '#1d0d48' : '#FCD2B3')};
  border: ${(props) => (props.routine === 'night' ? '2px solid rgb(227, 216, 227);' : '2px solid #1d0d48')};
  z-index: 90;

  img {
    height: 100%;
    object-fit: contain;
    padding: 5px 0 5px 0
  }

  h4,
  p {
    margin: 0;
    line-height: 90%;
    padding-top: 5px;
  }
`;

const ImgContainer = styled.div`
height: 50%;
`;

const BackButton = styled.button`
  font-size: 18px;
  padding: 10px;
  margin-top: 10px;
  width: 100px;
  background-color: #DB5A4F;
    border: none;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 43px;
  cursor: pointer;
`;

export const PopUp = ({ data, setSelectedProduct, getImagePath, setShowPopUp }) => {
  const handleBackButtonClick = () => {
    setSelectedProduct(null);
    setShowPopUp(false);
  };

  return (
    <Wrapper>
      <ProductWindow routine={data.productRoutine}>
        <ImgContainer>
          <img src={getImagePath(data.productCategory)} alt={data.productCategory} />
        </ImgContainer>
        <h4>{data.productName}</h4>
        <p>{data.productBrand}</p>
        <p>You have used this product {data.usageCount} times in total</p>
      </ProductWindow>
      <BackButton onClick={handleBackButtonClick}>Back</BackButton>

    </Wrapper>
  );
};
