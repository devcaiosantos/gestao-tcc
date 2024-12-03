import styled from "styled-components";
import { FormLabel, Input } from "@chakra-ui/react";
export const StyledTagContainer = styled.div`
  position: relative;
  width: 360px;
`;

export const StyledInput = styled(Input)`
  display: flex;
  flex-wrap: wrap;
  padding: 12px 10px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 2px;
  background-color: transparent;
  border: 1px solid #FFF; /* Cinza médio */

  &:focus {
    outline: none;
  }
`;

export const TagsInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const Tag = styled.div<{
  $isPresident?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ $isPresident }) => ($isPresident ? "rgb(75,181,67)" : "rgb(255, 255, 255)")};
  color: rgb(33, 37, 41); 
  padding: 2px 5px;
  margin: 0.1rem;
  border-radius: 3px;
  font-size: 1.0rem;
  font-family: 'Roboto', sans-serif;
  height: 40px;

  div{
    display: flex;
    align-items: center;
    p {
    width: ${({ $isPresident }) => ($isPresident ? "230px" : "300px")};

    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  }
  
  span {
    font-size: 0.8rem;
    color: rgb(33, 37, 41); 
    font-weight: bold;
  }

  .iconCancel {
    margin-left: 5px;
    font-size: 1.2rem;
    cursor: pointer;
  }
`;

export const AutoCompleteList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1px 0;
  position: absolute;
  border: none;
  border-radius: 5px;
  z-index: 9999;
  background-color: rgb(33, 37, 41); /* Cinza escuro */
  color: rgb(255, 255, 255); /* Branco */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  width: 100%;
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgb(108, 117, 125); /* Cinza médio */
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(0, 123, 255); /* Azul primário */
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(23, 162, 184); /* Azul claro */
  }
`;

export const AutoCompleteItem = styled.li<{ $selected?: boolean }>`
  padding: 2px 5px;
  cursor: pointer;
  background-color: ${({ $selected }) =>
    $selected ? "rgb(108, 117, 125)" : "rgb(33, 37, 41)"}; /* Cinza médio ou escuro */
  &:hover {
    background-color: rgb(108, 117, 125); /* Cinza médio */
    color: rgb(255, 255, 255); /* Branco */
  }
`;

export const StyledErrorMessage = styled.span`
  position: absolute;
  margin-top: 5px;
  bottom: -17px;
  left: 10px;
  font-size: 12px;
  color: rgb(128, 0, 0); /* Vermelho escuro */
  font-weight: bold;
`;

export const InputLabel = styled.p`
    font-size: 1.2rem;
    font-weight: bold;
    margin: 5px;
`
