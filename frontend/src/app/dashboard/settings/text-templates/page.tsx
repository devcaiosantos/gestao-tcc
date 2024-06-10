"use client"
import { useState, useEffect } from "react";
import { 
    Divider, 
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Button,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import { TitlePage } from "../../style";
import getAllTextTemplates from "@/services/text-template/findAll";
import { ITextTemplate } from "@/interfaces";
import {
    Container,
    ActionButtonsContainer,
    TableContainer,
    TableHeader,
    TableRow,
    TitleInfo,
    ContentInfo,
    AddTextTemplateButtonContainer,
    SearchInput,
    Toolbar
} from "./style"
import ModalCreateUpdateTextTemplate from "@/components/ModalTextTemplate/CreateUpdate";
import ModalDeleteTextTemplate from "@/components/ModalTextTemplate/Delete";
import { FaFileAlt, FaPlus, FaSearch, FaEdit } from "react-icons/fa";
import searchTextTemplatesByTerm from "@/services/text-template/search";
import useDebounce from "@/hooks/useDebounce";

export default function TextTemplates() {
    const [textTemplates, setTextTemplates] = useState<ITextTemplate[]>([]);
    const toast = useToast();
    const [isOpenModalTextTemplate, setIsOpenModalTextTemplate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchTextTemplates();
    }, []);

    useEffect(() => {
        searchTextTemplates();
    }, [debouncedSearchTerm]);

    async function fetchTextTemplates() {
        const response = await getAllTextTemplates();  
        if(response.status === "error"){
            toast({
                title: response.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }
        if(response.data){
            setTextTemplates(response.data)
        }
    }

    async function searchTextTemplates(){
        const response = await searchTextTemplatesByTerm(searchTerm); 
        if(response.status === "error"){
            toast({
                title: response.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }
        if(response.data){
            setTextTemplates(response.data)
        }
    }

    return (
        <Container>
            <TitlePage>
                <FaFileAlt/>
                Modelos de Texto
            </TitlePage>
            <Divider mb={"10px"}/>
            <Toolbar>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <FaSearch/>
                </InputLeftElement>
                <SearchInput 
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    placeholder="Pesquisar por título ou conteúdo"
                />
            </InputGroup>
                
                <ModalCreateUpdateTextTemplate 
                    isOpen={isOpenModalTextTemplate} 
                    setIsOpen={setIsOpenModalTextTemplate}
                    fetchTextTemplates={fetchTextTemplates}
                >
                    <AddTextTemplateButtonContainer>
                        <Button
                        colorScheme="blue"
                        variant="solid"
                        onClick={()=>setIsOpenModalTextTemplate(true)}
                        leftIcon={<FaPlus/>}
                        >
                            Cadastrar Modelo de Texto
                        </Button>
                    </AddTextTemplateButtonContainer>
                </ModalCreateUpdateTextTemplate>
            </Toolbar>
            <TextTemplatesTable 
                textTemplates={textTemplates}
                fetchTextTemplates={fetchTextTemplates}
            />
        </Container>
    );
}

const TextTemplatesTable = ({ textTemplates, fetchTextTemplates }: { 
    textTemplates: ITextTemplate[],
    fetchTextTemplates: () => void
}) => {
    const [selectedTextTemplate, setSelectedTextTemplate] = useState<ITextTemplate | null>(null);
    const [isOpenModalTextTemplate, setIsOpenModalTextTemplate] = useState(false);
    return ( 
        <TableContainer>
            <Table>
            <Thead>
                <Tr>
                    <TableHeader>
                        Título
                    </TableHeader>
                    <TableHeader>
                        Conteúdo
                    </TableHeader>
                    <TableHeader>
                        Tipo
                    </TableHeader>
                    <TableHeader>
                        
                    </TableHeader>
                </Tr>
            </Thead>
            <Tbody>
            {textTemplates && textTemplates.length > 0 ? (
                textTemplates.map((textTemplate) => {
                  return (
                    <TableRow
                    selected={selectedTextTemplate?.id === textTemplate.id}
                    onClick={()=>{setSelectedTextTemplate(textTemplate)}}
                    key={textTemplate.id} 
                    >
                        <Td>
                        <TitleInfo>
                            {textTemplate.title}
                        </TitleInfo>
                        </Td>
                        <Td>
                        <ContentInfo>
                            {textTemplate.content}
                        </ContentInfo>
                        </Td>
                        <Td>{textTemplate.type}</Td>
                        <Td>
                            <ActionButtonsContainer>
                                <ModalCreateUpdateTextTemplate
                                isOpen={isOpenModalTextTemplate} 
                                setIsOpen={setIsOpenModalTextTemplate}
                                fetchTextTemplates={fetchTextTemplates}
                                data={textTemplate}
                                >
                                    <Button
                                    variant={"outline"}
                                    colorScheme="blue" 
                                    onClick={()=>setIsOpenModalTextTemplate(true)}
                                    >
                                        <FaEdit/>
                                    </Button>
                                </ModalCreateUpdateTextTemplate>
                                <ModalDeleteTextTemplate
                                    data={textTemplate}
                                    fetchTextTemplates={fetchTextTemplates}
                                />
                            </ActionButtonsContainer>
                        </Td>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <Td colSpan={6}>Nenhum modelo de texto encontrado</Td>
                </TableRow>
              )}
            </Tbody>
            </Table>
        </TableContainer>
    );
}
