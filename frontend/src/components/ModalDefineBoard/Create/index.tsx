import { useEffect, useState } from 'react';
import {
    Tooltip,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast,
    Box,
    Spinner
} from '@chakra-ui/react'
import { Container } from '../style';
import { IEnrollmentStudent } from '@/interfaces';
import { GiTeacher } from "react-icons/gi";
import defineBoardAdmin from '@/services/enrollment/defineBoardAdmin';
import TagsInput from '@/components/TagsInput';
import getAllTeachers from '@/services/teacher/findAll';
import { ITeacher } from '@/interfaces';
import { object,  string, array, number, ValidationError } from 'yup';
interface ModalEndSemesterProps {
    data?: IEnrollmentStudent
    fetchEnrollments: () => void;
}

interface Option {
    id: number;
    title: string;
}

export default function ModalDefineBoard({data, fetchEnrollments}: ModalEndSemesterProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [selectedTeachers, setSelectedTeachers] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
      const defaultSelectedTeachers:Option[]= [];
      
      if(data?.supervisorId && data?.supervisorName){
        defaultSelectedTeachers.push({id: data.supervisorId, title: data?.supervisorName});
      }
      if(data?.coSupervisorId && data.coSupervisorName) {
        defaultSelectedTeachers.push({id: data.coSupervisorId, title: data.coSupervisorName});
      }

      setSelectedTeachers(defaultSelectedTeachers);
      fetchTeachers();
    }, [isOpen]);

    async function fetchTeachers() {
      const response = await getAllTeachers();  
      if(response.status == "error"){
          toast({
              title: response.message,
              status: "error",
              duration: 5000,
              isClosable: true
          });
          return;
      }
      if(response.data){
          setTeachers(response.data.filter(teacher => teacher.active))
      }
    }

    async function handleInputChange(value: Option[]) {
      setSelectedTeachers(value);
    }

    async function handleClick(){
      
      if(data){
        setIsLoading(true);
        const formattedData = {
          enrollmentId: data.id,
          presidentId: selectedTeachers[0].id,
          memberIds: selectedTeachers.map(teacher => teacher.id)
        }

        const schema = object().shape({
          enrollmentId: number().required(),
          memberIds: array()
          .min(3, "A banca deve ter no mínimo 3 membros").
          of(number()).required()
        });

        try {
          await schema.validate(formattedData);
        } catch (error) {
          if (error instanceof ValidationError) {
            toast({
              title: error.message,
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top"
            });
            setIsLoading(false);
            return;
          }
        }

        const response = await defineBoardAdmin(formattedData);
        setIsLoading(false);
        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        });
        if(response.status === "success"){
            fetchEnrollments();
            onClose();
        }
      }
    }
    
    return (
        <>
            <Tooltip label="Definir Banca" aria-label="A tooltip">
                <Button
                    onClick={onOpen}
                    colorScheme="yellow"
                    variant={"outline"}
                >
                    <GiTeacher/>
                </Button>
            </Tooltip>
          

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Definir Banca {data?.studentName} - {data?.studentRA}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Container>
                    <Box>
                        <TagsInput
                            id="tags"
                            label="Membros:"
                            placeholder="Selecione os membros da banca"
                            options={teachers.map(teacher => ({id: teacher.id, title: teacher.name}))}
                            selectedTags={selectedTeachers}
                            onChange={(value)=>handleInputChange(value)}
                        />

                    </Box>
                </Container>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  variant={"outline"}
                  colorScheme="yellow" 
                  onClick={handleClick}
                  isDisabled={isLoading}
                >
                  Definir
                  {isLoading && <Spinner ml={4} size="sm"/>}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}
