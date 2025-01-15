"use client"
import { ChangeEvent, useEffect, useState } from "react";
import { Divider, Button, Flex } from "@chakra-ui/react";
import { 
    Container, 
    InputWrapper, 
    InputField, 
    Label, 
    ChangePasswordWrapper, 
    SaveChangesWrapper,
    CredentialsStatusErrorText,
    CredentialsStatusSuccessText,
    GoogleCredentialButtons
} from "./style";
import { FaCheck, FaUser } from "react-icons/fa";
import { FiUser, FiMail } from "react-icons/fi";
import { BsGoogle } from "react-icons/bs";
import { FaMailBulk } from "react-icons/fa";
import { PiPasswordBold } from "react-icons/pi";
import { TitlePage } from "../style";
import useAuthContext from "@/hooks/useAuthContext";
import { object, number, string, ValidationError } from "yup";
import { useToast } from "@chakra-ui/react";
import updateAdminInfo from "@/services/administrator/updateAdminInfo";
import retrieveGoogleCredentials from "@/services/google-credentials/retrieveOne";
import ModalResetPassword from "@/components/ModalResetPassword";
import ModalCreateGoogleCredentials from "@/components/ModalGoogleCredentials/CreateCredentials";
import ModalUpdateGoogleCredentials from "@/components/ModalGoogleCredentials/UpdateCredentials";
import ModalDeleteGoogleCredentials from "@/components/ModalGoogleCredentials/DeleteCredentials";
import { IGoogleCredentials } from "@/interfaces";
import { FaXmark, FaCalendar } from "react-icons/fa6";

export default function Account() {

    const { admin, registerAdmin } = useAuthContext(); 
    const [tempData, setTempData] = useState(admin);
    const [googleCredentials, setGoogleCredentials] = useState<IGoogleCredentials | null>(null);
    const toast = useToast();

    useEffect(()=>{
        setTempData(admin);
        fetchGoogleCredentials();
    },[admin])

    async function fetchGoogleCredentials(){
        const response = await retrieveGoogleCredentials();
        setGoogleCredentials(response.data || null);
    }

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
            systemEmail: string().email("E-mail inválido"),
            systemEmailKey: string()
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
        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        })
        
        if(response.status=="success" && response.data){
            const formattedData = {
                id: response.data.id,
                name: response.data.nome,
                email: response.data.email,
                systemEmail: response.data.emailSistema,
                systemEmailKey: response.data.chaveEmailSistema
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
                    E-mail Sistema
                </Label>
                <InputField 
                    value={tempData?.systemEmail}
                    placeholder="Digite aqui o email noreply"
                    onChange={handleChange} 
                    name="systemEmail" />
            </InputWrapper>
            <InputWrapper>
                <Label>
                    <PiPasswordBold/>
                    Chave E-mail Sistema
                </Label>
                <InputField 
                    value={tempData?.systemEmailKey}
                    placeholder="Digite aqui a senha do email noreply"
                    onChange={handleChange} 
                    name="systemEmailKey" />
            </InputWrapper>
            <InputWrapper>
                <Label>
                    <FaCalendar/>
                    ID Calendário Google
                </Label>
                <InputField 
                    value={tempData?.calendarId}
                    placeholder="Digite aqui o ID do calendário Google"
                    onChange={handleChange} 
                    name="calendarId" />
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
            <InputWrapper>
                <Label>
                    <BsGoogle/>
                    Credenciais Google
                </Label>
                {
                    googleCredentials?
                    <CredentialsStatusSuccessText>
                        Credenciais já cadastradas
                        <FaCheck/>
                    </CredentialsStatusSuccessText>
                    :
                    <CredentialsStatusErrorText>
                        <FaXmark/>
                        Credenciais Google não cadastradas
                    </CredentialsStatusErrorText>
                }
                {
                    googleCredentials?
                    <GoogleCredentialButtons>
                        <ModalUpdateGoogleCredentials
                            googleCredentials={googleCredentials}
                            fetchGoogleCredentials={fetchGoogleCredentials}
                        />
                        <ModalDeleteGoogleCredentials 
                            googleCredentials={googleCredentials}
                            fetchGoogleCredentials={fetchGoogleCredentials}
                        />
                    </GoogleCredentialButtons>
                    :
                    <ModalCreateGoogleCredentials fetchGoogleCredentials={fetchGoogleCredentials}/>
                }
                
            </InputWrapper>
            <Divider mb={"10px"}/>
            <ChangePasswordWrapper>
                Deseja alterar sua senha de acesso?
                <ModalResetPassword/>
            </ChangePasswordWrapper>
        </Container>
    );
}
