import styled from 'styled-components';
// import confetti from 'canvas-confetti';

const BaseButton = styled.button`
  background-color: #e3e33f;
  cursor: pointer;
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
`;

export const AddProductButton = styled(BaseButton)`
`;
