import React from 'react';
import styled from 'styled-components';
import { StatisticsBackButton } from '../styles/StyledButtons.js';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
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
  z-index: 5;
`;

const ProductWindow = styled.div`
  width: 200px;
  height: fit-content;
  border-radius: 1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: ${(props) => (props.routine === 'morning' ? 'radial-gradient(circle at 15% 35%, rgba(255,220,203,1) 0%, rgb(238, 133, 85) 13%, rgb(113, 210, 110) 95%);' : 'rgba(5,19,6,0.8)')};
  color: ${(props) => (props.routine === 'morning' ? '#000' : '#eee')};
  border: ${(props) => (props.routine === 'night' ? '1px solid rgb(227, 216, 227);' : '1px solid #1d0d48')};
  z-index: 90;

  img {
    height: 100%;
    object-fit: contain;
    padding: 5px 0 5px 0;
    filter: ${(props) => (props.routine === 'night' ? ' invert(1)' : '')};
  }

  h4, h3,
  p {
    margin: 0;
    line-height: 90%;
    padding-top: 5px;
  }
  p {
    margin-bottom: 1rem;
  }
`;

const ImgContainer = styled.div`
height: 50%;
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
          <img
            src={getImagePath(data.productCategory)}
            alt={data.productCategory} />
        </ImgContainer>
        <h3>{data.productName}</h3>
        {data.productBrand.length > 0 && (<h4>{data.productBrand}</h4>)}
        <hr className="popup-divider night-popup" />
        <p>Times used in total: <span className="usagenumber">{data.usageCount}</span></p>
        {data.archived && <span className="usagenumber">Archived</span>}
        <StatisticsBackButton onClick={handleBackButtonClick}>Back</StatisticsBackButton>
      </ProductWindow>
    </Wrapper>
  );
};
