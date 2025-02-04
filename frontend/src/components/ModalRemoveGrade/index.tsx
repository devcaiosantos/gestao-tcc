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
import { IoMdRemoveCircle } from "react-icons/io";
import removeGrade from '@/services/enrollment/removeGrade';

interface ModalRemoveGradeProps {
    data?: IEnrollmentStudent
    fetchEnrollments: () => void;
}

export default function ModalRemoveGrade({data, fetchEnrollments}: ModalRemoveGradeProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    async function handleClick(){
      if(data){
        const response = await removeGrade(data.id);
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
          <Tooltip label="Remover Nota" aria-label="A tooltip">
            <Button 
              onClick={onOpen}
              variant={"outline"}
              colorScheme="red"
              fontSize={"lg"}
            >
              <IoMdRemoveCircle />
            </Button>
          </Tooltip>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Deseja remover esta nota?
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  A matrícula não terá mais uma nota atribuída e voltará ao status de "banca agendada".
                  Esta ação não poderá ser desfeita.
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