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
    useToast
} from '@chakra-ui/react'
import { ITeacher } from '@/interfaces';
import { FaTrash} from 'react-icons/fa';
import deleteTeacher from '@/services/teacher/delete';

interface ModalTeacherProps {
    data?: ITeacher
    fetchTeachers: () => void;
}
export default function ModalDeleteTeacher({data, fetchTeachers}: ModalTeacherProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    async function handleDelete(){
      if(data){
        const response = await deleteTeacher(data.id);
        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        });
        if(response.status === "success"){
          fetchTeachers();
          onClose();
        }
      }
    }
    return (
        <>
          <Button 
            colorScheme='red' 
            onClick={onOpen}
          >
            <FaTrash/>
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Deseja mesmo excluir professor?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                 Não será possível reverter essa ação.
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  colorScheme='red' 
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}