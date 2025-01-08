import {ChangeEvent, useEffect, useState, useRef} from "react";
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
    FormLabel
  } from "@chakra-ui/react"
import { Container, UploadFieldBox, CredentialsDisplay } from "./style"
import { object, string,ValidationError } from "yup"
import useAuthContext from "@/hooks/useAuthContext"
import { useToast } from "@chakra-ui/react"
import toCamelCase from "@/utils/toCamelCase"
import { FaTrash, FaUpload } from "react-icons/fa"
import { IGoogleCredentials } from "@/interfaces";
import updateGoogleCredentials from "@/services/google-credentials/update";

interface ModalProps {
    googleCredentials: IGoogleCredentials | null;
    fetchGoogleCredentials: ()=>void;
}

export default function ModalUpdateGoogleCredentials({googleCredentials, fetchGoogleCredentials}:ModalProps) {
    const [tmpGoogleCredentials, setTmpGoogleCredentials] = useState<IGoogleCredentials | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        setTmpGoogleCredentials(null);
    },[isOpen])

    const toast = useToast();

    async function handleUploadCredentials(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            toast({
                title: "Nenhum arquivo selecionado",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
    
        if (file.type !== "application/json") {
            toast({
                title: "Formato de arquivo inválido",
                description: "Por favor, selecione um arquivo JSON válido.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = async (event) => {
            try {
                const content = event.target?.result;
                if (typeof content !== "string") {
                    throw new Error("Erro ao ler o arquivo.");
                }
                const jsonData = JSON.parse(content);

                const formattedData = toCamelCase(jsonData);

                setTmpGoogleCredentials(formattedData);

            } catch (error) {
                toast({
                    title: "Erro ao processar o arquivo",
                    description: "Certifique-se de que o arquivo é um JSON válido.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
    
        reader.onerror = () => {
            toast({
                title: "Erro ao ler o arquivo",
                description: "Não foi possível carregar o arquivo. Tente novamente.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        };
    
        reader.readAsText(file);
    }

    async function handleSubmit(){
        if(tmpGoogleCredentials){
            const response = await updateGoogleCredentials(tmpGoogleCredentials);

            toast({
                title: response.status === "success" ? "Credenciais Google cadastradas com sucesso" : "Erro ao cadastrar credenciais Google",
                description: response.status === "success"?"":response.message,
                status: response.status,
                duration: 5000,
                isClosable: true,
            });

            if(response.status === "success"){
                fetchGoogleCredentials();
                onClose();
            }
        }

    }

    function removeFile(){
        if(fileInputRef.current){
            fileInputRef.current.value = "";
            setTmpGoogleCredentials(null);
        }
    }


    return (
      <>
        <Button
            colorScheme="yellow"
            variant={"outline"}
            onClick={onOpen}
            leftIcon={<FaUpload />}
        >
            Atualizar Credenciais Google
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Atualizar Credenciais Google</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Container>
                    <UploadFieldBox>
                        <FormLabel>Arquivo JSON de Credenciais Google</FormLabel>
                        <Input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".json" 
                            onChange={handleUploadCredentials} 
                            multiple={false}
                            padding={1}
                        />
                        {
                            tmpGoogleCredentials && 
                            <Button
                            onClick={removeFile}
                            colorScheme="yellow"
                            variant={"ghost"}
                            leftIcon={<FaTrash />}
                            >
                                Remover Arquivo
                            </Button>
                        }
                        
                    </UploadFieldBox>
                </Container>
                {
                    (googleCredentials || tmpGoogleCredentials) && 
                    <CredentialsDisplay>
                        <pre>
                            {
                                tmpGoogleCredentials
                                ?JSON.stringify(tmpGoogleCredentials, null, 2)
                                :JSON.stringify(googleCredentials, null, 2)
                            }
                        </pre>
                    </CredentialsDisplay>
                }
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme='green' 
                onClick={handleSubmit}
                isDisabled={!tmpGoogleCredentials}
                >
                 Atualizar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }