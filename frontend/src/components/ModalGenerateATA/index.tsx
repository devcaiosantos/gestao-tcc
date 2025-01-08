import React, { useEffect, useState } from 'react';
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
    Tooltip,
    useToast,
    Select,
    Box,
    Textarea,
    Text,
} from '@chakra-ui/react';
import { IoDocumentText } from "react-icons/io5";
import findAllTextTemplates from '@/services/text-template/findAll';
import { ITextTemplate, IEnrollmentStudent } from '@/interfaces';
import { SelectContainer, ContainerModal, LabelSelect } from './style';
import findAllTeachers from '@/services/teacher/findAll';
import { IoDocuments } from "react-icons/io5";

interface ModalGenerateATAProps {
    data?: IEnrollmentStudent
}


const ModalGenerateATA = ({data}:ModalGenerateATAProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ATATemplates, setATATemplates] = useState<ITextTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<ITextTemplate | null>(null);
    const [content, setContent] = useState<string>("");	
    const [copied, setCopied] = useState(false);
    const toast = useToast();

    useEffect(() => {
        retriveTextTemplates();
        setCopied(false);   
        setSelectedTemplate(null);
        setContent("");
    }, [isOpen]);



    async function retriveTextTemplates() {
        const response = await findAllTextTemplates();
        
        if (response.status === "error") {
           toast({
                title: "Erro ao buscar modelos de texto",
                description: response.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return;
        } 

        const ATATemplates = response.data?.filter(template => template.type === "ATA");
        if(ATATemplates) {
            setATATemplates(ATATemplates);
        }
    }

    const handleChangeTemplate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = Number(event.target.value);
        const template = ATATemplates.find(template => template.id === templateId);
        setSelectedTemplate(template || null);
    };

    const handleGenerateATA = async () => {
        if(selectedTemplate) {

            let formattedContent = selectedTemplate.content;
            if(data?.boardDateTime){
                formattedContent = formattedContent.replace(/<dataHora>/g, formatDate(data.boardDateTime));
            }
            if(data?.studentName){
                formattedContent = formattedContent.replace(/<nomeAluno>/g, data.studentName);
            }
            if(data?.supervisorName){
                formattedContent = formattedContent.replace(/<orientador>/g, data?.supervisorName);
            }
            if(data?.coSupervisorName){
                formattedContent = formattedContent.replace(/<coorientador>/g, data?.coSupervisorName);
            }
            if(data?.boardLocal){
                formattedContent = formattedContent.replace(/<local>/g, data?.boardLocal);
            }

            if(data?.boardTitle){
                formattedContent = formattedContent.replace(/<tituloTrabalho>/g, data?.boardTitle);
            }

            if(data?.members && data?.members.length > 0){
                const response = await findAllTeachers();
                if(response.data){
                    const teachersName = response.data.map(
                        teacher => data.members.includes(teacher.id) 
                        ? teacher.name : null)
                        .filter(Boolean).join(", ");

                    formattedContent = formattedContent.replace(/<membrosBanca>/g, teachersName);
                }
            }
            setContent(formattedContent);
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(content);
        setCopied(true);
    }



    return (
        <>
            <Tooltip label="Gerar Texto ATA" aria-label="A tooltip">
                <Button 
                    onClick={onOpen}
                    colorScheme="pink"
                    variant={"outline"}
                >
                    <IoDocumentText/>
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Gerar ATA</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ContainerModal>
                            <Box>
                                <LabelSelect>
                                    Modelo de texto:
                                </LabelSelect>
                                <SelectContainer>
                                    <Select 
                                        value={selectedTemplate?.id}
                                        onChange={handleChangeTemplate}
                                        placeholder="Selecione um modelo de texto"
                                    >
                                        {ATATemplates.map(template => (
                                            <option key={template.id} value={template.id}>{template.title}</option>
                                        ))}
                                    </Select>
                                    <Button 
                                        onClick={()=>handleGenerateATA()}
                                        colorScheme="blue"
                                        isDisabled={!selectedTemplate}
                                    >
                                        Carregar
                                    </Button>
                                </SelectContainer>
                            </Box>
                            <Box>
                                <Textarea 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Digite o conteúdo da ata"
                                    rows={20}
                                />
                            </Box>
                       </ContainerModal>
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            leftIcon={<IoDocuments/>}
                            onClick={()=>copyToClipboard()}
                            variant="solid"
                            colorScheme={copied?"green":"gray"}
                            isDisabled={!content}
                        >
                           {copied?"Copiado":"Copiar"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalGenerateATA;

// Função para formatar a data
function formatDate(date: Date) {
    // Mapear os meses em português
    const months = [
      "janeiro", "fevereiro", "março", "abril", 
      "maio", "junho", "julho", "agosto", 
      "setembro", "outubro", "novembro", "dezembro"
    ];
  
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${hours}:${minutes} do dia ${day} de ${month} de ${year}`;
  }
  