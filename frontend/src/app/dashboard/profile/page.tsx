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
import { TitlePage } from "../style";
import useAuthContext from "@/hooks/useAuthContext";
import { object, number, string, ValidationError } from "yup";
import { useToast } from "@chakra-ui/react";
import updateAdminInfo from "@/services/administrator/updateAdminInfo";
import ModalResetPassword from "@/components/ModalResetPassword";

export default function Account() {

    const { admin, registerAdmin } = useAuthContext(); 
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
        if(!tempData){
            return;
        }
        const scheme = object().shape({
            name: string().required("Nome de usuário é obrigatório"),
            email: string().email("E-mail inválido").required("E-mail é obrigatório"),
            email_system: string().email("E-mail inválido"),
            password_email_system: string()
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

        const response = await updateAdminInfo(tempData);
        toast(
            {
                title: response.message,
                status: response.status,
                duration: 5000,
                isClosable: true
            }
        )
        
        if(response.status=="success" && response.data){
            const formattedData = {
                id: response.data.id,
                name: response.data.nome,
                email: response.data.email,
                email_system: response.data.email_sistema,
                password_email_system: response.data.senha_email_sistema
           }
           registerAdmin(formattedData);
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
            <SaveChangesWrapper display={tempData!=admin?"inherit":"none"}>
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
                <ModalResetPassword/>
            </ChangePasswordWrapper>
        </Container>
    );
}
