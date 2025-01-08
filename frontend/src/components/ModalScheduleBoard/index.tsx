import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text,
    Input,
    FormControl,
    FormLabel,
    useToast,
    Tooltip,
    Spinner
} from '@chakra-ui/react';
import { Container, ErrorText, OpenModalButton } from './style';
import { IEnrollmentStudent } from '@/interfaces';
import { object, string, ValidationError } from 'yup';
import scheduleBoardAdmin from '@/services/enrollment/scheduleBoardAdmin';
import { FaCalendarDays } from 'react-icons/fa6';

interface ModalProps {
    enrollment: IEnrollmentStudent;
    fetchEnrollments: () => void;
}

const ScheduleModal = ({enrollment, fetchEnrollments}: ModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({
        location: '',
        dateTime: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({
        location: '',
        dateTime: ''
    });

    const toast = useToast();

    async function handleSubmit() {
        const schema = object().shape({
            location: string().required('Informe o local'),
            dateTime: string().required('Informe a data e horário')
        });

        try{
            await schema.validate(formData, {abortEarly: false});
        }
        catch(err){
            if(err instanceof ValidationError){
                const yupErrors: ValidationError = err;
                const newErrors: Record<string, string> = {};
                yupErrors.inner.forEach((e) => {
                    newErrors[e.path as string] = e.message;
                });
                setErrors(newErrors);
            }
            return;
        }

        setIsLoading(true);

        const response = await scheduleBoardAdmin({
            enrollmentId: enrollment.id,
            location: formData.location,
            dateTime: new Date(formData.dateTime).toISOString()
        });

        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        });
        
        setIsLoading(false);
        if(response.status === 'success'){
            fetchEnrollments();
            onClose();
        }
    }
    
    return (
        <>
            <Tooltip label='Agendar Banca' aria-label='Agendar Banca'>
                <Button 
                    variant='outline'
                    onClick={onOpen}
                    colorScheme='blue'
                >
                    <FaCalendarDays />
                </Button>
            </Tooltip>
            

            <Modal isOpen={isOpen} onClose={onClose}
            closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Agendamento de Banca</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Container>
                            <Text>Aluno: {enrollment.studentName} (RA: {enrollment.studentRA})</Text>
                            <FormControl>
                                <FormLabel>Local</FormLabel>
                                <Input 
                                    type="text" 
                                    placeholder="Digite o local, ex: Bloco A, Sala 101"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                />
                                {errors.location && <ErrorText>{errors.location}</ErrorText>}
                            </FormControl>
                            <FormControl>
                                <FormLabel>Data/Horário</FormLabel>
                                <Input 
                                    type="datetime-local" 
                                    placeholder="Digite a data e horário"
                                    value={formData.dateTime}
                                    onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                                />
                                {errors.dateTime && <ErrorText>{errors.dateTime}</ErrorText>}
                            </FormControl>
                        </Container>
                    </ModalBody>

                    <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button 
                        colorScheme='blue' 
                        onClick={handleSubmit}
                        variant='ghost'
                        isDisabled={isLoading}
                    >
                        {isLoading
                        ?<Spinner />
                        :"Agendar"}
                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ScheduleModal;