import styled from 'styled-components';

export const BaseButton = styled.button`
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight:600;
  background-color: #051306;
  text-align: center;
  width: fit-content;
  font-family: 'Lalezar', cursive;
  letter-spacing: 1px;
  font-size: 1.2rem;
  font-weight: 400;
  color: rgba(255, 244, 233, 0.9);
  border: rgba(255, 244, 233, 0.85) 1px solid;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 1px 1px 8px 4px rgba(5, 19, 6, 0.3);
  &:hover {
    background: radial-gradient(circle at 15% 35%, rgba(255,220,203,1) 0%, rgb(238, 133, 85) 13%, rgb(113, 210, 110) 95%);
    border: #051306 1px solid;
  }
  &:focus {
    background: radial-gradient(circle at 15% 35%, rgba(255,220,203,1) 0%, rgb(238, 133, 85) 13%, rgb(113, 210, 110) 95%);
    border: #051306 1px solid;
  }
  
  &:active {
    background: whitesmoke;
    border: none;
  }
`;

export const UserFormButton = styled(BaseButton)`
 padding: 0.2rem 0.6rem;
 margin-bottom: 15%;
 color:  #ea9350;
 &:hover {
  color: #051306;
 }
`;

export const HideFormButton = styled(BaseButton)`
 padding: 0.2rem 0.6rem;
 margin-bottom: 15%;
 background-color: rgba(5, 19, 6, 0.7);
 &:hover {
  color: #051306;
 }
`;

export const ReportButton = styled(BaseButton)`
`;

export const DeleteProductButton = styled(BaseButton)`
  ${(props) => props.clicked
    && `
    background: #1d0d48; 
  `}
  font-size: 1rem;
  padding: 0.3rem 0.5rem;
`;

export const SaveButton = styled(BaseButton)`
font-size: 1rem;
height: 100%;
  padding: 0.3rem 0.5rem;
`;

export const BackButton = styled(BaseButton)`
font-size: 1rem;
  padding: 0.3rem 0.8rem;
`;

export const ProductFormButton = styled(BaseButton)`
`;

export const StatisticsBackButton = styled(BaseButton)`
font-size: 1rem;
  padding: 0.3rem 0.8rem;
margin: 10px 0 6px 0;
`;

export const ArchiveButton = styled(BaseButton)`
margin-top: 30px;
`;

export const FavoriteButton = styled(BaseButton)`
height: 40px;
aspect-ratio: 1/1;
border-radius: 50%;
display: flex;
justify-content: center;
align-items: center;
background: radial-gradient(circle at 15% 35%, rgba(255,220,203,1) 0%, rgb(238, 133, 85) 13%, rgb(113, 210, 110) 95%);
/*
::before {
    content: url('../../images/star.png');
    vertical-align: middle;
    margin-right: 5px;
    height: 30px;
    aspect-ratio: 1/1;
    z-index: 1;
  }*/
`;