import styled from "styled-components";
import { FormLabel, Input, Flex } from "@chakra-ui/react";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  height: 100%;
`;

export const Label = styled(FormLabel)`
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 10px;
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