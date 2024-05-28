import styled from "styled-components";
import { NumberInput, Th, Text, Button } from '@chakra-ui/react';
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  height: 100%;
`;


export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

export const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const NumberInputStyled = styled(NumberInput)`
  width: 100px;
`;

export const TableContainer = styled.div`
    /* overflowY={'auto'}
    maxHeight={isSmallerThan800?'400px':'700px'} */
    overflow-y: auto;
    max-height: 700px;
    @media (max-width: 800px) {
        max-height: 400px;
    }
`;

export const TableHeader = styled(Th)`
  /* position={"sticky"}
  top={"0"}
  bg={"gray.700"}
  color={"white"}
  fontFamily={"Roboto,sans-serif"} */
  position: sticky;
  top: 0;
  background-color: gray.700;
  color: white;
`;
interface TableRowProps {
  selected?: boolean;
}
export const TableRow = styled.tr<TableRowProps>`
  background: ${(props) => (props.selected ? '#1a202c' : 'transparent')};
  color: ${(props) => (props.selected ? 'white' : 'inherit')};
  cursor: pointer;
  &:hover {
    background: #1a202c;
    color: white;
  }
`;

export const NameInfo  = styled(Text)`
  width: 150px;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmailInfo = styled(Text)`
  width: 150px;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AddTeacherButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  Button {
    max-width: 200px;
  }
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;  
`