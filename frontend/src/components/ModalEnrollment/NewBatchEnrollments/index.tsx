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
    Textarea,
    useDisclosure
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Container, EnrollmentsTextarea } from './style';
import { object, string, ValidationError } from 'yup';
import createEnrollment from '@/services/enrollment/create';
import findStudentByRA from '@/services/student/findByRa';
import { FaUsers } from 'react-icons/fa';
import useDebounce from "@/hooks/useDebounce";

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

const placeholderEnrollments = ""
+ "123456, João, joao@gmail.com"
+ "\n654321, Maria, maria@gmail.com"
+ "\n987654, José, jose@gmail.com"


export default function ModalCreateBatchEnrollments({fetchEnrollments}: ModalCreateEnrollmentProps) {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [tempData, setTempData] = useState<TempDataProps>(defaultData);
    const toast = useToast();
    const debouncedRa = useDebounce(tempData?.ra, 500);

    useEffect(()=>{
        setTempData(defaultData);
    },[isOpen])

    useEffect(() => {
        if (debouncedRa) {
            handleAutoFill(debouncedRa);
        }
    },[debouncedRa])

    async function handleAutoFill(ra:string){
        console.log(ra)
        const response = await findStudentByRA(ra);
        if(response.status === "success" && response.data){
            console.log(response.data)
            setTempData(response.data);
        }
    }

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
            console.log(tempData)
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
                        onChange={(e)=>handleChange("enrollments", e.target.value)}
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