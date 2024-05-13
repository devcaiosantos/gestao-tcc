import styled from "styled-components";
import { Input, Flex } from "@chakra-ui/react";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  height: 100%;
`;

export const Label = styled(Flex)`
    display: "flex";
    align-items: center;
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 10px;
    gap: 5px;
    svg{
      font-size: 1.4rem;
      font-weight: 900;
    }
`;

export const InputField = styled(Input)`
  display: flex;
  width: 100%;
  padding: 20px;
`;

export const InputWrapper = styled(Flex)`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

export const SaveChangesWrapper = styled(Flex)`
  display: flex;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  align-items: center;
  margin-bottom: 20px;
`;

export const ChangePasswordWrapper = styled(Flex)`
  display: flex;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  align-items: center;
  margin-top: 20px;
`;