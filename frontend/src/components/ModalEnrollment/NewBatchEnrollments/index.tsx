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
    useDisclosure
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Container, EnrollmentsTextarea } from './style';
import { object, string, ValidationError } from 'yup';
import createBatchEnrollment from '@/services/enrollment/createBatch';
import { FaUsers } from 'react-icons/fa';

interface ModalCreateEnrollmentProps {
    fetchEnrollments: () => void;
}

const placeholderEnrollments = ""
+ "123456, João, joao@gmail.com"
+ "\n654321, Maria, maria@gmail.com"
+ "\n987654, José, jose@gmail.com"


export default function ModalCreateBatchEnrollments({fetchEnrollments}: ModalCreateEnrollmentProps) {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [inputValue, setInputValue] = useState("");
    const toast = useToast();

    useEffect(()=>{
        setInputValue("");
    },[isOpen])


    function handleChange(value:string){
        setInputValue(value);
    }

    async function handleSubmit(){
        const schema = object().shape({
            ra: string().required("O RA é obrigatório"),
            name: string().required("O nome é obrigatório"),
            email: string().email("O e-mail informado não é válido").required("O e-mail é obrigatório")
        });
    
        const lines = inputValue.split("\n");
        const enrollments = [];
        for (const [index, enrollment] of lines.entries()) {
            const [ra, name, email] = enrollment.trim().split(",");
            
            const formattedEnrollment = {
                ra: ra.trim(),
                name: name.trim(),
                email: email.trim()
            };
            try {
                await schema.validate(formattedEnrollment);
            } catch (err) {
                if (err instanceof ValidationError) {
                    toast({
                        title: `Formato inválido de matrícula na linha ${index + 1}`,
                        description: err.message,
                        status: "error",
                        position: "top",
                        duration: 5000,
                        isClosable: true
                    });
                    return;
                }
            }
            enrollments.push(formattedEnrollment);
        }
    
        const response = await createBatchEnrollment(enrollments);
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
                leftIcon={<FaUsers/>}
            >
                Matricular em lote
            </Button>
          <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Nova Matrícula em Lote</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                 <Container>
                    <FormLabel>
                        Adicione no campo abaixo as informações dos alunos que deseja matricular.
                        <br/>
                        A ordem das informações deve ser: RA, nome, e-mail.
                    </FormLabel>
                    <EnrollmentsTextarea 
                        placeholder={placeholderEnrollments}
                        onChange={(e)=>handleChange(e.target.value)}
                    />
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