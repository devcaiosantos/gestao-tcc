import { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    Input,
    Box,
    useDisclosure
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Container } from './style';
import { object, string, ValidationError } from 'yup';
import createEnrollment from '@/services/enrollment/create';
import { FaUserPlus } from 'react-icons/fa';

interface ModalCreateEnrollmentProps {
    fetchEnrollments: () => void;
}

interface TempDataProps {
    name: string;
    email: string;
    ra: string;
}
const defaultData = {
    name: '',
    email: '',
    ra: ''
}

export default function ModalCreateEnrollment({fetchEnrollments}: ModalCreateEnrollmentProps) {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [tempData, setTempData] = useState<TempDataProps>(defaultData);
    const toast = useToast();

    useEffect(()=>{
        setTempData(defaultData);
    },[isOpen])

    function handleChange(key:string, value:string | boolean){
        setTempData({...tempData, [key]: value});
    }

    async function handleSubmit(){
        const schema = object().shape({
            name: string().required("Nome é obrigatório"),
            email: string().email("Email inválido").required("Email é obrigatório"),
            ra: string().required("RA é obrigatório")
        });

        try{
            await schema.validate(tempData);
        }catch(error){
            if(error instanceof ValidationError){
                return toast({
                    title: error.message,
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true
                });
            }
        }

        handleCreateEnrollment();
    }

    async function handleCreateEnrollment(){
        const response = await createEnrollment(tempData);
        toast({
            title: response.message,
            status: response.status,
            position: "top",
            duration: 5000,
            isClosable: true
        });
        if(response.status === "success"){
            fetchEnrollments();
            onClose();
        }
    }


    return (
        <>
            <Button
                onClick={onOpen}
                colorScheme="blue"
                variant="solid"
                leftIcon={<FaUserPlus/>}
            >
               Nova Matrícula
            </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Nova Matrícula</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                 <Container>
                    <Box> 
                        <FormLabel>Registro do Aluno (RA)</FormLabel>
                        <Input
                            value={tempData?.ra}
                            onChange={(e) => handleChange("ra", e.target.value)}
                            placeholder="Digite o registro do aluno"
                        />
                    </Box>
                    <Box> 
                        <FormLabel>Nome Completo</FormLabel>
                        <Input 
                            value={tempData?.name} 
                            onChange={(e) =>handleChange("name", e.target.value)} 
                            placeholder="Digite o nome completo do aluno" 
                        />
                    </Box>
                    <Box> 
                        <FormLabel>E-mail</FormLabel>
                        <Input 
                            value={tempData?.email} 
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Digite o e-mail do aluno" 
                        />
                    </Box>
                 </Container>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={()=>onClose()}>
                  Cancelar
                </Button>
                <Button 
                  colorScheme='green' 
                  variant='ghost'
                  onClick={handleSubmit}
                >
                   Matricular
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}