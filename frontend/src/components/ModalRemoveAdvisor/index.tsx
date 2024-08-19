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
import removeAdvisor from '@/services/enrollment/removeAdvisor';

interface ModalRemoveAdvisorProps {
    data?: IEnrollmentStudent
    fetchEnrollments: () => void;
}

export default function ModalRemoveAdvisor({data, fetchEnrollments}: ModalRemoveAdvisorProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    async function handleClick(){
      if(data){
        const response = await removeAdvisor(data.id);
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
          <Tooltip label="Remover Orientador e Coorientador" aria-label="A tooltip">
            <Button 
              onClick={onOpen}
              colorScheme="red"
              variant="outline"
              leftIcon={<MdGroupRemove/>}
              fontSize={"lg"}
            >
            </Button>
          </Tooltip>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Deseja remover o Orientador e Coorientador dessa matrícula?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>
                  <strong>Nome do Aluno:</strong>{data?.studentName}
                  <br/>
                  <b>Orientador:</b>{data?.supervisorName}
                  <br/>
                  <b>Coorientador:</b>{data?.coSupervisorName}
                  <br/>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  A matrícula será atualizada para o status de "matriculado", e o orientador e coorientador serão removidos.
                  Essa ação não poderá ser desfeita.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  colorScheme='red' 
                  variant='outline'
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