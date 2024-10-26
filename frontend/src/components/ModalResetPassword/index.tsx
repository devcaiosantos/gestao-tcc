import {useState} from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure, 
    Input,
    FormLabel,
    Box
  } from "@chakra-ui/react"
import { Container } from "./style"
import { object, string,ValidationError } from "yup"
import useAuthContext from "@/hooks/useAuthContext"
import { useToast } from "@chakra-ui/react"
import resetPassword from "@/services/administrator/resetPassword"
export default function ModalResetPassword() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { admin } = useAuthContext();
    const [data, setData] = useState({
        confirmPassword: "",
        newPassword: "",
        currentPassword: "",
    });
    const toast = useToast()

    function handleChange(key:string, value:string){
        setData({...data, [key]: value});
    }

    async function handleResetPassword(){
        const scheme = object().shape({
            currentPassword: string().required("Senha atual é obrigatória"),
            newPassword: string()
            .min(8,"A senha deve ter pelo menos 8 caractéres")
            .required("Nova senha é obrigatória"),
            confirmPassword: string()
            .test(
                "passwords-match",
                "As senhas não coincidem",
                function(value){
                    return this.parent.newPassword === value;
                }
            )
            .required("Confirmação de senha é obrigatória")
        });
        try	{
            await scheme.validate(data);
        }catch(error){
            if (error instanceof ValidationError) {
                return toast(
                    {
                        title: error.message,
                        status: "error",
                        position: "top",
                        duration: 5000,
                        isClosable: true
                    }
                )
            }
        }
        if(!admin || !admin.id) return;
        
        const response = await resetPassword({id: admin?.id, currentPassword: data.currentPassword, newPassword: data.newPassword});
        toast(
            {
                title: response.message,
                status: response.status,
                duration: 5000,
                isClosable: true
            }
        )
        if(response.status === "success"){
            onClose();
        }
    }

    return (
      <>
        <Button
            colorScheme="red"
            variant={"outline"}
            onClick={onOpen}
        >
            Redefinir Senha
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Redefinir Senha</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Container>
                    <Box> 
                        <FormLabel>Senha Atual</FormLabel>
                        <Input 
                            value={data.currentPassword} 
                            onChange={(e) => handleChange("currentPassword", e.target.value)} 
                            type={"password"} 
                            placeholder="Digite sua senha atual" 
                        />
                    </Box>
                    <Box> 
                        <FormLabel>Nova Senha</FormLabel>
                        <Input 
                            value={data.newPassword} 
                            onChange={(e) => handleChange("newPassword", e.target.value)}
                            type={"password"} 
                            placeholder="Digite sua nova senha" mb="15px"/>
                        <Input 
                            value={data.confirmPassword}
                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === "Enter"){
                                    handleResetPassword()
                                }
                            }}
                            type={"password"} 
                            placeholder="Confirme sua nova senha" 
                        />
                    </Box>
                    
                </Container>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                colorScheme='red' 
                onClick={handleResetPassword}
                variant='ghost'>
                Pronto
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }