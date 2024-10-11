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
import { FaExclamationCircle } from 'react-icons/fa';
import endSemester from '@/services/enrollment/endSemester';

interface ModalEndSemesterProps {
    data?: ISemester
    fetchEnrollments: () => void;
}
export default function ModalEndSemester({data, fetchEnrollments}: ModalEndSemesterProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    async function handleClick(){
      if(data){
        const response = await endSemester(data.id);
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
          <Button
            onClick={onOpen}
            colorScheme="red"
            leftIcon={<FaExclamationCircle/>}
          >
            Finalizar Semestre
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Deseja Finalizar Semestre?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                 {/* eslint-disable-next-line react/no-unescaped-entities */}
                Todas as matrículas que não atingiram o status de "aprovado" ou "reprovado" serão atualizadas para "não finalizado".
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  variant={"outline"}
                  colorScheme='red' 
                  onClick={handleClick}
                >
                  Finalizar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}