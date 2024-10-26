import styled from "styled-components";
import { Th, Text, Input, Flex, Select } from '@chakra-ui/react';
import theme from "@/style/theme";
const { colors } = theme;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.dark800};
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.dark700};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.dark600};
  }
`;

export const TableHeader = styled(Th)`
  position: sticky;
  top: 0;
  background-color: ${colors.dark700};
  color: white !important;
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

export const EnrollmentInfo = styled(Text)`
  height: 40px;
  width: 200px;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AddEnrollmentButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
`;

export const Toolbar1 = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  @media (max-width: 1070px) {
    align-items: flex-start;
    flex-direction: column-reverse;
    gap: 10px;
  }
`;
export const Toolbar2= styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column-reverse;
    gap: 10px;
  }
`;

export const SearchInput = styled(Input)`
  max-width: 300px;
  border-left: 0;
`;

export const FilterStatusContainer = styled(Flex)`
  width: 300px;
  align-items: center;  
  gap: 10px;
  height: 40px;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatusFilterSelect = styled(Select)`
`;
