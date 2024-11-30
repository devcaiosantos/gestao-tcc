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
    useToast,
    Tooltip
} from '@chakra-ui/react'
import { IEnrollmentStudent } from '@/interfaces';
import { MdGroupRemove } from "react-icons/md";
import removeBoard from '@/services/enrollment/removeBoard';

interface ModalRemoveAdvisorProps {
    data?: IEnrollmentStudent
    fetchEnrollments: () => void;
}

export default function ModalRemoveBoard({data, fetchEnrollments}: ModalRemoveAdvisorProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    async function handleClick(){
      if(data){
        const response = await removeBoard(data.id);
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
          <Tooltip label="Remover Banca" aria-label="A tooltip">
            <Button 
              onClick={onOpen}
              variant={"outline"}
              colorScheme="red"
              fontSize={"lg"}
            >
              <MdGroupRemove />
            </Button>
          </Tooltip>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Deseja remover a banca da matrícula?
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  A matrícula será atualizada para o status de "orientador definido", as informações de banca serão removidas.
                  Essa ação não poderá ser desfeita.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  colorScheme='red' 
                  variant={"outline"}
                  onClick={handleClick}
                >
                  Remover
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}