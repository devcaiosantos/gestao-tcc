import styled from '@emotion/styled';
import { Button, Input, FormLabel } from '@chakra-ui/react';

export const StyledFormLabel = styled(FormLabel)`
    font-size: 1.2rem;
    font-weight: bold;
`;

// Estilização do Input
export const StyledInput = styled(Input)`
    font-size: 1.5rem;
    padding: 0.75rem 1rem;
`;

// Estilização do Button Aprovar/Reprovar
export const StyledButton = styled(Button)`
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ colorScheme }) => (colorScheme === 'green' ? '#38a169' : '#e53e3e')};
  }
`;
