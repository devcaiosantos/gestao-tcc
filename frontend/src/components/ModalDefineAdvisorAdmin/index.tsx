import {useEffect, useState} from "react";
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
    Box,
    Select,
    Tooltip,
    Spinner
  } from "@chakra-ui/react"
import { Container } from "./style"
import { object, number, ValidationError } from "yup"
import useAuthContext from "@/hooks/useAuthContext"
import { useToast } from "@chakra-ui/react"
import findAllTeachers from "@/services/teacher/findAll";
import defineAdvisorAdmin from "@/services/enrollment/defineAdvisorAdmin";
import { ITeacher } from "@/interfaces";
import { FaChalkboardTeacher } from "react-icons/fa";

interface ModalProps {
    enrollmentId: number;
    fetchEnrollments: () => void;
}

interface dataProps {
    advisorId?: number;
    coAdvisorId?: number;
}

export default function ModalDefineAdvisorAdmin({enrollmentId, fetchEnrollments}: ModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { admin } = useAuthContext();
    const [data, setData] = useState<dataProps | undefined>();
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [loading, setLoading] = useState(false); // Estado de loading
    
    const toast = useToast();

    useEffect(() => {
        fetchTeachers();
    }, []);

    async function fetchTeachers(){
        const response = await findAllTeachers();
        if(response.status === "error"){
            toast(
                {
                    title: "Não foi possível carregar a lista de professores",
                    description: "Verifique se existem professores cadastrados e ativos",
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true
                }
            )
        }
        if(response.data){
            setTeachers(response.data.filter((value)=>value.active));
        }
    }

    function handleChange(key: string, value: string) {
        setData((prevData: dataProps | undefined) => ({
            ...prevData,
            [key]: parseInt(value),
        }));
    }

    async function handleSubmit(){
        const scheme = object().shape({
            advisorId: number()
            .oneOf(teachers.map((teacher) => teacher.id)).required("O campo de orientador é obrigatório")
            .required("O campo de orientador é obrigatório"),

            coAdvisorId: number()
            .oneOf(teachers.map((teacher) => teacher.id))
        });
        try {
            await scheme.validate(data);
        } catch(error) {
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

        if(!data?.advisorId) return;

        setLoading(true); // Inicia o loading
        const response = await defineAdvisorAdmin({
            advisorId: data?.advisorId,
            coAdvisorId: data?.coAdvisorId,
            enrollmentId: enrollmentId
        });
        setLoading(false); // Termina o loading
        toast(
            {
                title: response.message,
                status: response.status,
                duration: 5000,
                isClosable: true
            }
        )
        if(response.status === "success"){
            fetchEnrollments();
            onClose();
        }
    }

    return (
      <>
        <Tooltip label="Definir Orientador" aria-label="Definir Orientador">
            <Button
                color="#feb2b2"
                variant="outline"
                onClick={onOpen}
            >
                <FaChalkboardTeacher/>
            </Button>
        </Tooltip>
        
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Definir Orientador</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Container>
                    <Box> 
                        <FormLabel>Orientador</FormLabel>
                        <Select
                            value={data?.advisorId ?? ''}
                            onChange={(e) => handleChange("advisorId", e.target.value)}
                            placeholder="Selecione o orientador"
                        >
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                        </Select>
                    </Box>
                    <Box>
                        <FormLabel>Coorientador</FormLabel>
                        <Select
                            value={data?.coAdvisorId}
                            onChange={(e) => handleChange("coAdvisorId", e.target.value)}
                            placeholder="Selecione o coorientador (opcional)"
                        >
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                        </Select>
                    </Box>
                </Container>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                color="#feb2b2"
                onClick={handleSubmit}
                variant='ghost'
                isDisabled={loading} // Desabilita o botão enquanto carrega
              >
                {loading ? <Spinner size="sm"/> : "Definir"} 
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
