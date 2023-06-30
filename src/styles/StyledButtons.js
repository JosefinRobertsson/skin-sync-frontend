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
  color: rgba(255, 244, 233, 0.85);
  border: rgba(255, 244, 233, 0.85) 1px solid;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 1px 1px 8px 4px rgba(5, 19, 6, 0.3);
  &:hover {
    background-color: rgba(232, 140, 93, 0.85);
    border: #051306 1px solid;
  }
  &:focus {
    border: 2px solid violet;
    background-color: rgba(232, 140, 93, 0.85);
  }
`;

export const UserFormButton = styled(BaseButton)`
 padding: 0.2rem 0.6rem;
 margin-bottom: 15%;
`;

export const ReportButton = styled(BaseButton)`
`;

export const DeleteProductButton = styled(BaseButton)`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  ${(props) => props.clicked
    && `
    background: #1d0d48;; 
  `}
`;

export const AddProductButton = styled(BaseButton)`
`;
