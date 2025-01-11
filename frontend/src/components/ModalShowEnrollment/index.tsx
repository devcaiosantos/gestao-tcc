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
    Text
} from '@chakra-ui/react'
import { IEnrollmentStudent } from '@/interfaces';
import { Container } from './style';
import { IoMdEye } from 'react-icons/io';

interface ModalShowEnrollmentProps {
    data?: IEnrollmentStudent
}

export default function ModalShowEnrollment({ data }: ModalShowEnrollmentProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    
    return (
        <>
          <Tooltip label="Informações Matrícula" aria-label="A tooltip">
            <Button 
              onClick={onOpen}
              variant={"outline"}
              colorScheme="green"
              fontSize={"lg"}
            >
              <IoMdEye />
            </Button>
          </Tooltip>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Informações Matrícula
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Container>
                    <Text><b>Aluno:</b> {data?.studentName} </Text>
                    <Text><b>RA:</b> {data?.studentRA}</Text>
                    {data?.boardTitle && <Text><b>Titulo do Trabalho:</b> {data?.boardTitle}</Text>}
                    {data?.supervisorName && <Text> <b>Orientador:</b> {data?.supervisorName}</Text>}
                    {data?.coSupervisorName && <Text><b>Coorientador:</b> {data?.coSupervisorName}</Text>}
                    {data?.boardLocal && <Text> <b>Local:</b> {data?.boardLocal}</Text> } 
                    {data?.boardDateTime && <Text><b>Data e Hora:</b> {new Date(data?.boardDateTime).toLocaleString()}</Text>}
                </Container>
              
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}