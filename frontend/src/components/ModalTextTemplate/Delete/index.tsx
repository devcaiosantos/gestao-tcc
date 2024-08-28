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
import { ITextTemplate } from '@/interfaces';
import { FaTrash} from 'react-icons/fa';
import deleteTextTemplate from '@/services/text-template/delete';

interface ModalTextTemplateProps {
    data?: ITextTemplate
    fetchTextTemplates: () => void;
}
export default function ModalDeleteTextTemplate({data, fetchTextTemplates}: ModalTextTemplateProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    async function handleDelete(){
      if(data){
        const response = await deleteTextTemplate(data.id);
        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        });
        if(response.status === "success"){
            fetchTextTemplates();
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
              <ModalHeader>Deseja excluir Modelo de Texto?</ModalHeader>
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