import styled from "styled-components";
import theme from '@/style/theme';
const { colors, fonts } = theme;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

export const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 600px;
`;

export const StudentInfo = styled.div`
    font-size: 1.2rem;
    font-weight: normal;
`;

export const Note = styled.div`
    font-size: 0.8rem;
    color: ${colors.info};
    margin-top: 5px;
`;

export const ResponseContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

export const InputLabel = styled.p`
    font-size: 1.2rem;
    font-weight: bold;
    margin: 5px;
`

export const InputBox = styled.div`
    margin: 5px 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;