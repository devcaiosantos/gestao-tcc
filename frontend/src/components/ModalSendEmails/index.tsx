import { use, useState, useEffect } from 'react';
import RetrieveTextTemplates from '../../services/text-template/findAll';
import RetrieveEnrollments from '../../services/enrollment/findAllBySemester';
import SendDirectMail from '../../services/email/sendDirectMail';
import { ITextTemplate } from '@/interfaces';
import { statusOptions } from '@/app/dashboard/tcc1/page';
import useAuthContext from '@/hooks/useAuthContext';
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
    Select,
    Box,
    FormLabel,
    Flex,
    Textarea,
    Divider,
    Input,
    Spinner
} from '@chakra-ui/react'
import { Container, InputAndButtonContainer, LoadingContainer } from './style';
import { FaMailBulk } from 'react-icons/fa';
import { EnrollmentStatus } from '@/interfaces';
import {object, string, array, ValidationError} from 'yup';
interface IFormData {
    status: EnrollmentStatus | "todos";
    recipients: string;
    textTemplateId: string;
    subject: string;
    text: string;
}

const defaultFormData:IFormData  = {
    status: "todos",
    recipients: "",
    textTemplateId: "",
    subject: "",
    text: ""
}

export default function ModalSendEmails() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [textTemplates, setTextTemplates] = useState<ITextTemplate[]>([]);
    const [formData, setFormData] = useState<IFormData>(defaultFormData);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { activeSemester } = useAuthContext();

    useEffect(() => {
        async function fetchData() {
            const response = await RetrieveTextTemplates();
            if(response.data){
                setTextTemplates(response.data.filter(
                    (textTemplate: ITextTemplate) => textTemplate.type === "EMAIL"
                ));
            }
        }
        fetchData();
        setFormData(defaultFormData); // Reset form data

    }, [isOpen]);

    async function loadRecipientsByStatus(status: EnrollmentStatus | "todos"){
        if(activeSemester){
            const response = await RetrieveEnrollments({
                semesterId: activeSemester.id,
                status: status,
                term: ""
            });

            if(response.status === "error"){
                toast({
                    title: "Erro ao carregar destinatários",
                    description: response.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }

            const formattedRecipients = response.data?.map((enrollment) => {
                return enrollment.studentEmail;
            }).toString();
            if(formattedRecipients){
                handleChange(
                    {
                        key: "recipients",
                        value: formData.recipients.length>0?formData.recipients+","+formattedRecipients:formattedRecipients
                    }
                );
            }
        }
        
    }

    const handleChange = ({key, value}: {key: string, value: string}) => {
        setFormData({
            ...formData,
            [key]: value
        });
    }

    const handleTextTemplateChange = (value:string) => {
        const selectedTextTemplate = textTemplates.find((textTemplate) => textTemplate.id === Number(value));
        if(selectedTextTemplate){
            handleChange({key: "text",value: selectedTextTemplate.content})
        }
    }

    const handleSendEmail = async () => {
        setIsLoading(true);
        const data = {
            recipients: formData.recipients.trim().split(","),
            subject: formData.subject,
            text: formData.text
        }

        const schema = object().shape({
            recipients: array().of(string().email()).required(),
            subject: string().required("O assunto do e-mail é obrigatório"),
            text: string().required("O conteúdo do e-mail é obrigatório")
        });
        try {
            await schema.validate(data);
        } catch (error) {
            if (error instanceof ValidationError) {
                toast({
                    title: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
            return;
        }

        const response = await SendDirectMail(data);
        setIsLoading(false);
        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        });


        if(response.status === "success"){
            onClose();
        }
    }

    return (
        <>
          <Button
            colorScheme="cyan"
            leftIcon={<FaMailBulk/>}
            onClick={onOpen}
            >
            Enviar E-mails
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                maxW={"900px"}
            >
              <ModalHeader>Enviar E-mails</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Container>
                    <Box>
                        <FormLabel>Carregar destinatários por status</FormLabel>
                        <InputAndButtonContainer>
                            <Select
                                value={formData.status}
                                onChange={(event) => handleChange({key: "status", value: event.target.value})}
                                placeholder="Selecione um status"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </Select>
                            <Button
                                colorScheme="blue"
                                onClick={() => loadRecipientsByStatus(formData.status)}
                                isDisabled={!formData.status}
                            >
                                Carregar
                            </Button>
                        </InputAndButtonContainer>
                    </Box>
                    <Box>
                        <FormLabel>Destinatários</FormLabel>
                        <Textarea
                            value={formData.recipients}
                            onChange={(event) => handleChange({key: "recipients", value: event.target.value})}
                            placeholder="Digite os e-mails dos destinatários separados por vírgula"
                        > 
                        </Textarea>
                    </Box>
                    <Divider/>
                    <Box>
                        <FormLabel>Assunto</FormLabel>
                        <Input
                            value={formData.subject}
                            onChange={(event) => handleChange({key: "subject", value: event.target.value})}
                            placeholder="Digite o assunto do e-mail"
                        >
                        </Input>
                    </Box>
                    <Divider/>
                    <Box>   
                        <FormLabel>Modelo de e-mail</FormLabel>
                        <InputAndButtonContainer>
                            <Select 
                                value={formData.textTemplateId} 
                                onChange={(event) => handleChange({key: "textTemplateId", value: event.target.value})}
                                placeholder="Selecione um modelo de texto"
                            >
                                {textTemplates.map((textTemplate) => (
                                    <option key={textTemplate.id} value={textTemplate.id}>
                                        {textTemplate.title}
                                    </option>
                                ))}
                            </Select>
                            <Button 
                                colorScheme="blue"
                                onClick={() => handleTextTemplateChange(formData.textTemplateId)}
                                isDisabled={!formData.textTemplateId}
                            >
                                Carregar
                            </Button>
                        </InputAndButtonContainer>
                    </Box>
                    <Box> 
                        <FormLabel>Conteúdo</FormLabel>
                        <Textarea
                            value={formData.text}
                            onChange={(event) => handleChange({key: "text", value: event.target.value})}
                            placeholder="Digite o conteúdo do e-mail"
                        >
                        </Textarea>
                    </Box>

                </Container>
              </ModalBody>
              <ModalFooter>
                <Button 
                isDisabled={isLoading}
                colorScheme='blue' 
                mr={3} 
                onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button 
                    onClick={handleSendEmail}
                    colorScheme='green' 
                    isDisabled={isLoading}
                >
                    {
                        isLoading?
                        <LoadingContainer>
                            <Spinner size="xs"/>
                            Enviando...
                        </LoadingContainer>
                        :
                        "Enviar"
                    }
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}