import styled from "styled-components";
import theme from '@/style/theme';
const { colors, fonts } = theme;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 600px;
`;

export const Note = styled.div`
    font-size: 0.8rem;
    color: ${colors.info};
    margin-top: 5px;
`;