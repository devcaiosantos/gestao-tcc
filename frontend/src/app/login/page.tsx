"use client"
import React,{ useState } from "react";
import {
    Container,
    Form,
    Label,
    Input,
    Button,
    ErrorMessage,
    MailIcon,
    PasswordIcon
}from "./style";
import { useToast } from '@chakra-ui/react'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const toast = useToast();

    const handleLogin = () => {
        console.log("asdkasldk");
        console.log(toast)
        toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
      return    
    };
  
    return (
      <Container>
        <button onClick={()=>console.log("AAAAAAAAAAA")} >AAAAA</button>
        <Form>
          <Label htmlFor="email">
            <MailIcon />
            E-mail:
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Label htmlFor="password">
            <PasswordIcon />
            Senha:
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button type="button" onClick={()=>handleLogin()}>Entrar</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </Container>
    );
  }
  