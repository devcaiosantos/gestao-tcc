"use client"
import React,{ useState } from "react";
import auth from "@/services/auth";
import {
    Container,
    Form,
    Label,
    Input,
    Button,
    ErrorMessage,
    MailIcon,
    PasswordIcon,
    Title
}from "./style";
import Loader from "@/components/LoadingBouncingBalls";
import { useToast } from '@chakra-ui/react'
import { object, string, ValidationError  } from "yup";
import {setCookie} from "@/utils/cookies";
import { useRouter } from "next/navigation";
import useAuthContext from "@/hooks/useAuthContext";

export default function Login() {
    const {registerAdmin} = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        const schema = object().shape({
            email: string().email("Informe um e-mail válido").required("Informe seu e-mail"),
            password: string().required("Informe sua senha")
        });
        try {
            await schema.validate({
                email,
                password
            });
            setError('');
        } catch (error) {
            if (error instanceof ValidationError) {
                setError(error.message);
            }
            return;
        }

        // Aqui você deve fazer a chamada para a API de login
        const response = await auth({email, password});
        if(response.status === "error"){
          toast({
            title: 'Falha ao realizar login',
            description: response.message,
            status: response.status,
            duration: 9000,
            isClosable: true,
          })
        }
        
        if(response.status === "success" && response.data?.access_token){
          registerAdmin({
            id: response.data.id,
            name: response.data.nome,
            email: response.data.email,
            systemEmail: response.data.emailSistema,
            systemEmailKey: response.data.chaveEmailSistema,
            calendarId: response.data.idCalendario
          });
          setCookie({ 
            name: "tcc-token",
            value: response.data.access_token,
            days: 1
          });
          router.push("/dashboard");
        }
        return    
    };
  
    return (
      <Container>
        <Title>GESTÃO TCC</Title>
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin().then(() => setIsLoading(false));
              }}
            }
          />
          <Button 
            type="button"
            onClick={()=>handleLogin().then(()=>setIsLoading(false))}
            disabled={isLoading}
          >
            {!isLoading && "Entrar"}
            {isLoading && <Loader />}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </Container>
    );
  }
  