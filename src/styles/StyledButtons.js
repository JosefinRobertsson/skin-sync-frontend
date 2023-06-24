import styled from 'styled-components';
// import confetti from 'canvas-confetti';

const BaseButton = styled.button`
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight:600
`;
/*
const handleConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};
*/
export const LoginButton = styled(BaseButton)`
`;

export const RegisterButton = styled(BaseButton)`
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
