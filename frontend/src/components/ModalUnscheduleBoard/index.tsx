import { useState } from 'react';
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
    Tooltip,
    Spinner
} from '@chakra-ui/react'
import { IEnrollmentStudent } from '@/interfaces';
import { MdCalendarMonth } from "react-icons/md";
import unscheduleBoard  from '@/services/enrollment/unscheduleBoard';
import { FaCalendarXmark } from 'react-icons/fa6';

interface ModalUnscheduleBoardProps {
    data?: IEnrollmentStudent
    fetchEnrollments: () => void;
}

export default function ModalUnscheduleBoard({data, fetchEnrollments}: ModalUnscheduleBoardProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    async function handleClick(){
      setIsLoading(true);
      if(data){
        const response = await unscheduleBoard(data.id);
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
      setIsLoading(false);
    }
    return (
        <>
          <Tooltip label="Desmarcar Banca" aria-label="A tooltip">
            <Button 
              onClick={onOpen}
              variant={"outline"}
              colorScheme="red"
              fontSize={"lg"}
            >
              <FaCalendarXmark />
            </Button>
          </Tooltip>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Deseja desmarcar a banca?
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  A matrícula será atualizada para o status de "banca preenchida", as informações de agendamento serão removidas.
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
                  {
                    isLoading ? <Spinner /> : "Desmarcar"
                  }
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}