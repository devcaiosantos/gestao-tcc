
import styled from "styled-components";
import theme from "@/style/theme";
export const LoadContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: ${theme.colors.dark};
    color: ${theme.colors.light};
`

export const WelcomeTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
`;

export const TitlePage = styled.h1`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    @media (max-width: 768px) {
        font-size: 1.5rem;
        flex-direction: column;
        justify-content: center;
    }
`;

export const FailedConnectionBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-align: center;
    }
`


