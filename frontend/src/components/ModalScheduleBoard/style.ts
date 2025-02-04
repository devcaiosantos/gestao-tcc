import { Button } from "@chakra-ui/react";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
`;

export const ErrorText = styled.p`
    color: red;
    font-size: 14px;
`;

export const OpenModalButton = styled(Button)`
    background-color: #90cdf4;
`