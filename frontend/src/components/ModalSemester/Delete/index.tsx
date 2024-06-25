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
import { ISemester } from '@/interfaces';
import { FaTrash } from 'react-icons/fa';
import deleteSemester from '@/services/semester/delete';

interface ModalSemesterProps {
    data?: ISemester;
    fetchSemesters: () => void;
}

export default function ModalDeleteSemester({data, fetchSemesters}: ModalSemesterProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    async function handleDelete(){
        if(data){
            const response = await deleteSemester(data.id);
            toast({
                title: response.message,
                status: response.status,
                duration: 5000,
                isClosable: true
            });
            if(response.status === "success"){
                fetchSemesters();
                onClose();
            }
        }
    }

    return (
        <>
            <Button 
                colorScheme='red' 
                onClick={onOpen}
                variant="outline"
            >
                <FaTrash/>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Deseja mesmo excluir o semestre?</ModalHeader>
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
                            variant='outline'
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
