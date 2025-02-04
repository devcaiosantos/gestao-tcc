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
    Text
  } from "@chakra-ui/react"
import { Container, CredentialsDisplay } from "./style"
import { useToast } from "@chakra-ui/react"
import { FaXmark } from "react-icons/fa6"
import { IGoogleCredentials } from "@/interfaces";
import removeGoogleCredentials from "@/services/google-credentials/removeOne";

interface ModalProps {
    googleCredentials: IGoogleCredentials | null;
    fetchGoogleCredentials: ()=>void;
}

export default function ModalDeleteGoogleCredentials(
    {
        googleCredentials,
        fetchGoogleCredentials
    }:ModalProps
    ) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
   
    async function handleSubmit(){
        const response = await removeGoogleCredentials();
        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        });

        if(response.status=="success"){
            fetchGoogleCredentials();
            onClose();
        }

    }

    return (
      <>
        <Button
            colorScheme="red"
            variant={"outline"}
            onClick={onOpen}
            leftIcon={<FaXmark />}
        >
            Remover Credenciais Google
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Remover Credenciais Google</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Container>
                   <Text>
                        Deseja realmente remover as credenciais do google?
                   </Text>
                </Container>
                {
                    googleCredentials && 
                    <CredentialsDisplay>
                        <pre>{JSON.stringify(googleCredentials, null, 2)}</pre>
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
                variant='ghost'
                disabled={!googleCredentials}
                >
                 Remover
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }