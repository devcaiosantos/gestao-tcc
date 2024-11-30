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
    FormControl,
    FormLabel,
    Input,
    Spinner
} from '@chakra-ui/react'
import { Container } from '../style';
import { IEnrollmentStudent } from '@/interfaces';
import { GiTeacher } from "react-icons/gi";
import updateBoardAdmin from '@/services/enrollment/updateBoardAdmin';
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

export default function ModalUpdateBoard({data, fetchEnrollments}: ModalEndSemesterProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [selectedTeachers, setSelectedTeachers] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    useEffect(() => {
      fetchTeachers();
    }, [isOpen]);

    useEffect(()=>{
      if(teachers && data){
        const orderedMembers = [
          data.presidentId,
          ...data.members.filter(member => member !== data.presidentId),
        ];
        const defaultSelectedTeachers:Option[]= orderedMembers.map(member => {
          const teacher = teachers.find(teacher => teacher.id === member);
          return {id: teacher?.id || 0, title: teacher?.name || ""};
        });
        setSelectedTeachers(defaultSelectedTeachers);
      }
    },[teachers])

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

        const response = await updateBoardAdmin(formattedData);
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
            <Tooltip label="Alterar Banca" aria-label="A tooltip">
                <Button
                    onClick={onOpen}
                    colorScheme="cyan"
                    variant={"outline"}
                >
                    <GiTeacher/>
                </Button>
            </Tooltip>
          

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Alterar Banca {data?.studentName} - {data?.studentRA}</ModalHeader>
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
                  Alterar
                  {isLoading && <Spinner ml={4} size="sm"/>}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}
