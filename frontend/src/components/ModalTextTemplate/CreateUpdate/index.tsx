import { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    Input,
    Select,
    Box,
    useToast, 
    Textarea,
    Text,
    Tooltip 
} from '@chakra-ui/react';
import { Container, TagsContainer, TagsItem } from './style';
import { ITextTemplate } from '@/interfaces'; 
import { string, object, ValidationError } from 'yup';
import createTextTemplate from '@/services/text-template/create'; 
import updateTextTemplate from '@/services/text-template/update'; 
import { FaPlus } from 'react-icons/fa';

interface ModalTextTemplateProps {
    children?: React.ReactNode;
    data?: ITextTemplate;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    fetchTextTemplates: () => void;
}

export default function ModalCreateUpdateTextTemplate({ children, data, isOpen, setIsOpen, fetchTextTemplates }: ModalTextTemplateProps) {
    const [tempData, setTempData] = useState({
        title: data?.title || '',
        content: data?.content || '',
        type: data?.type || ''
    });
    const toast = useToast();

    useEffect(() => {
        if (!isOpen) {
            setTempData({
                title: '',
                content: '',
                type: ''
            });
        }

        if (data && data.id) {
            setTempData({
                title: data.title,
                content: data.content,
                type: data.type
            });
        }


    }, [isOpen, data]);

    function handleChange(key: keyof ITextTemplate, value: string) {
        setTempData({ ...tempData, [key]: value });
    }

    async function handleSubmit() {
        const schema = object().shape({
            title: string().required('Título é obrigatório'),
            content: string().required('Conteúdo é obrigatório'),
            type: string().required('Tipo é obrigatório'),
        });

        try {
            await schema.validate(tempData);
        } catch (error) {
            if (error instanceof ValidationError) {
                return toast({
                    title: error.message,
                    status: 'error',
                    position: 'top',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }

        if (data && data.id) {
            handleUpdateTextTemplate();
        } else {
            handleCreateTextTemplate();
        }
    }

    async function handleCreateTextTemplate() {
        const response = await createTextTemplate(tempData);
        toast({
            title: response.message,
            status: response.status,
            position: 'top',
            duration: 5000,
            isClosable: true,
        });
        if (response.status === 'success') {
            fetchTextTemplates();
            setIsOpen(false);
        }
    }

    async function handleUpdateTextTemplate() {
        if (data && data.id) {
            const response = await updateTextTemplate({...tempData, id: data.id});
            toast({
                title: response.message,
                status: response.status,
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
            if (response.status === 'success') {
                fetchTextTemplates();
                setIsOpen(false);
            }
        }
    }

    return (
        <>
            {children}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={"2xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{data && data.id ? 'Editar Modelo de Texto' : 'Criar Novo Modelo de Texto'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Container>
                            <Box>
                                <FormLabel>Título</FormLabel>
                                <Input
                                    value={tempData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="Digite o título do template"
                                />
                            </Box>
                            <Box>
                                <FormLabel>Tipo</FormLabel>
                                <Select
                                    placeholder="Selecione o tipo"
                                    value={tempData.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                >
                                    <option value="EMAIL">E-MAIL</option>
                                    <option value="ATA">ATA</option>
                                    <option value="DECLARACAO">DECLARAÇÃO</option>
                                </Select>
                            </Box>
                            <Box>
                                <FormLabel>Conteúdo</FormLabel>
                                <Textarea
                                    value={tempData.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    placeholder="Digite o conteúdo do template"
                                />
                                <TagsContainer>
                                    <Text>
                                        Tags disponíveis: 
                                    </Text>
                                    {
                                    
                                        tempData.type &&
                                        (tempData.type === "ATA" || tempData.type === "EMAIL" || tempData.type === "DECLARACAO") 
                                        &&
                                        TagsList[tempData.type].map(tag => (
                                            <Button
                                                key={tag.tag}
                                                size="sm"
                                                variant={"outline"}
                                                onClick={() => handleChange('content', `${tempData.content}${tag.tag}`)}
                                                rightIcon={<FaPlus/>}
                                            >
                                                <Tooltip
                                                    label={tag.label}
                                                >
                                                    {tag.tag} 
                                                </Tooltip>
                                            </Button>
                                        ))
                                    }
                                </TagsContainer>
                            </Box>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button colorScheme="green" onClick={handleSubmit}>
                            {data && data.id ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}


const TagsList = {
    EMAIL:[
        {
            tag: "<linkDefinirOrientador>",
            label: "Link para tela de definição de orientador",
        },
        {
            tag: "<linkDefinirBanca>",
            label: "Link para tela de definição de banca",
        },
        {
            tag: "<linkAgendarBanca>",
            label: "Link para tela de agendamento de banca",
        },
        {
            tag: "<nomeAluno>",
            label: "Nome do aluno",
        },
    ],
    ATA: [
        {
            tag: "<dataHora>",
            label: "Data e hora",
        },
        {
            tag: "<local>",
            label: "Local",
        },
        {
            tag:"<nomeAluno>",
            label: "Nome do aluno",
        },
        {
            tag: "<tituloTrabalho>",
            label: "Título do trabalho",
        },
        {
            tag: "<orientador>",
            label: "Orientador",
        },
        {
            tag: "<coorientador>",
            label: "Coorientador",
        },
        {
            tag: "<membrosBanca>",
            label: "Membros da banca 1",
        },
    ],
    DECLARACAO: []
}