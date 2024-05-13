"use client"
import { Flex } from "@chakra-ui/react";
import { Container, InputWrapper, InputField, Label } from "./style";
import { FiUser } from "react-icons/fi";

export default function Settings() {
    return (
        <Container>
            <InputWrapper>
                <Label>Nome de Usuário</Label>
                <InputField placeholder="Digite aqui seu nome de usuário" />
            </InputWrapper>
            <InputWrapper>
                <Label>E-mail</Label>
                <InputField placeholder="Email" leftIcon={<FiUser/>} />
            </InputWrapper>
        </Container>
    );
}