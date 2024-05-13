import styled from "styled-components";
import { Box } from "@chakra-ui/react";
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Title = styled.h1`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

export const Item = styled(Box)`
    display: flex;
    font-size: 1.2rem;
    flex-direction: row;
    align-items: center;
    padding: 20px;
    width: 100%;
    cursor: pointer;
    &:hover {
        background-color: rgb(26, 32, 44);
    }
    svg {
        font-size: 1.5rem;
        margin-right: 10px;
    }
`;

