import styled, { keyframes } from 'styled-components';
import theme from '@/style/theme';
const bounceAnimation = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
`;

export const BouncingBalls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    width: 10px;
    height: 10px;
    background-color: ${theme.colors.light};
    border-radius: 50%;
    margin: 0 5px;
    animation: ${bounceAnimation} 1.0s infinite ease-in-out;
  }

  div:nth-child(2) {
    animation-delay: 0.2s;
  }

  div:nth-child(3) {
    animation-delay: 0.4s;
  }
`;