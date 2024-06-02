import styled from "styled-components";
import { NumberInput, Th, Text, Td } from '@chakra-ui/react';
import theme from "@/style/theme";
const { colors } = theme;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
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
    overflow-y: auto;
    max-height: 550px;
    @media (max-width: 800px) {
        max-height: 400px;
    }
    @media (max-width: 600px) {
        max-height: 300px;
    }
`;

export const TableHeader = styled(Th)`
  position: sticky;
  top: 0;
  background-color: ${colors.dark700};
  color: white;
`;
interface TableRowProps {
  selected?: boolean;
}
export const TableRow = styled.tr<TableRowProps>`
  background: ${(props) => (props.selected ? colors.dark600 : 'transparent')};
  color: ${(props) => (props.selected ? 'white' : 'inherit')};
  cursor: pointer;
  &:hover {
    background: ${colors.dark800};
    color: white;
  }

`;

export const NameInfo  = styled(Text)`
  height: 40px;
  width: 200px;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmailInfo = styled(Text)`
  display: flex;
  align-items: center;
  height: 40px;
  width: 200px;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AddTeacherButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  Button {
    max-width: 200px;
  }

`;

export const ActionButtonsContainer = styled.div`
  height: 40px;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;  
`