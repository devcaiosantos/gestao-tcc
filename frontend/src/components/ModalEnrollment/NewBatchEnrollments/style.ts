import styled from 'styled-components';
import { Textarea } from '@chakra-ui/react';
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
`;

export const EnrollmentsTextarea = styled(Textarea)`
    height: 400px !important;
`;