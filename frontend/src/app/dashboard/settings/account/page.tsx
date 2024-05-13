"use client"
import { ChangeEvent, useState } from "react";
import { Divider, Button } from "@chakra-ui/react";
import { 
    Container, 
    InputWrapper, 
    InputField, 
    Label, 
    ChangePasswordWrapper, 
    SaveChangesWrapper 
} from "./style";
import { FaUser } from "react-icons/fa";
import { FiUser, FiMail } from "react-icons/fi";
import { FaMailBulk } from "react-icons/fa";
import { PiPasswordBold } from "react-icons/pi";
import { TitlePage } from "../../style";
import useAuthContext from "@/hooks/useAuthContext";
import { object, number, string, ValidationError } from "yup";
import { useToast } from "@chakra-ui/react";
export default function Account() {

    const { admin } = useAuthContext(); 
    const [tempData, setTempData] = useState(admin);
    const toast = useToast();

    function handleChange(e:ChangeEvent<HTMLInputElement>){
        const {name, value} = e.target;
        if(!tempData){
            return;
        }
        setTempData({...tempData, [name]: value});
    }

    async function handleSaveChanges(){
        const scheme = object().shape({
            name: string().required("Nome de usuário é obrigatório"),
            email: string().email("E-mail inválido").required("E-mail é obrigatório"),
            email_system: string().email("E-mail inválido").required("E-mail é obrigatório"),
            password_email_system: string().required("Senha é obrigatória")
        });

        try	{
            await scheme.validate(tempData);
        }catch(error){
            if (error instanceof ValidationError) {
                return toast(
                    {
                        title: error.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    }
                )
            }
        }
    }

    function handleUndoChanges(){
        setTempData(admin);
    }

    return (
        <Container>
            <TitlePage>
                <FaUser/>
                Informações da Conta	
            </TitlePage>
            <Divider mb={"10px"}/>
            <InputWrapper>
                <Label>
                    <FiUser/> 
                    Nome de Usuário
                </Label>
                <InputField 
                    value={tempData?.name}
                    placeholder="Digite aqui seu nome de usuário"
                    onChange={handleChange} 
                    name="name" />
            </InputWrapper>
            <InputWrapper>
                <Label>
                    <FiMail/>
                    E-mail
                </Label>
                <InputField 
                    value={tempData?.email}
                    placeholder="Digite aqui seu email de acesso"
                    onChange={handleChange} 
                    name="email" />
            </InputWrapper>
            <InputWrapper>
                <Label>
                    <FaMailBulk/>
                    E-mail NoReply
                </Label>
                <InputField 
                    value={tempData?.email_system}
                    placeholder="Digite aqui o email noreply"
                    onChange={handleChange} 
                    name="email_system" />
            </InputWrapper>
            <InputWrapper>
                <Label>
                    <PiPasswordBold/>
                    Senha E-mail NoReply
                </Label>
                <InputField 
                    value={tempData?.password_email_system}
                    placeholder="Digite aqui a senha do email noreply"
                    onChange={handleChange} 
                    name="password_email_system" />
            </InputWrapper>
            <SaveChangesWrapper>
                <Button
                    colorScheme="red"
                    variant="solid"
                    onClick={handleUndoChanges}
                >
                    Desfazer
                </Button>
                <Button
                    colorScheme="green"
                    variant="solid"
                    onClick={handleSaveChanges}
                >
                    Salvar Alterações
                </Button>
            </SaveChangesWrapper>
            <Divider mb={"10px"}/>
            <ChangePasswordWrapper>
                Deseja alterar sua senha de acesso?
                <Button
                    colorScheme="red"
                    variant="outline"
                >
                    Alterar Senha
                </Button>
            </ChangePasswordWrapper>
        </Container>
    );
}
