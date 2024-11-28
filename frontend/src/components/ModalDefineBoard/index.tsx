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
} from '@chakra-ui/react'
import { Container } from './style';
import { IEnrollmentStudent } from '@/interfaces';
import { GiTeacher } from "react-icons/gi";
import defineBoardAdmin from '@/services/enrollment/defineBoardAdmin';


interface ModalEndSemesterProps {
    data?: IEnrollmentStudent
    fetchEnrollments: () => void;
}
export default function ModalDefineBoard({data, fetchEnrollments}: ModalEndSemesterProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    async function handleClick(){
      if(data){
        const response = await defineBoardAdmin({
            enrollmentId: data.id,
            memberIds: [1, 2, 3]
        });
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
                        <FormControl>
                            <FormLabel>


                            </FormLabel>
                        </FormControl>

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
                >
                  Definir
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}