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
import { Container, ActionButtonsContainer } from "./style";
import getAllTeachers from "@/services/teacher/findAll";
import { ITeacher } from "@/interfaces";
import {
    FlexBox,
    TableContainer,
    TableHeader,
    TableRow,
    NameInfo,
    EmailInfo,
    AddTeacherButtonContainer,
    SearchInput,
    Toolbar
} from "./style"
import ModalCreateUpdateTeacher from "@/components/ModalTeacher/CreateUpdate";
import ModalDeleteTeacher from "@/components/ModalTeacher/Delete";
import { FaUserPlus, FaUserEdit, FaChalkboardTeacher, FaSearch  } from "react-icons/fa";
import searchTeachersByTerm from "@/services/teacher/search";
import useDebounce from "@/hooks/useDebounce";

export default function Teachers() {
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const toast = useToast();
    const [isOpenModalTeacher, setIsOpenModalTeacher] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        searchTeachers();
    }, [debouncedSearchTerm]);

    async function fetchTeachers() {
        const response = await getAllTeachers();  
        if(response.status == "error"){
            toast({
                title: response.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }
        if(response.data){
            setTeachers(response.data)
        }
    }

    async function searchTeachers(){
        const response = await searchTeachersByTerm(searchTerm); 
        if(response.status == "error"){
            toast({
                title: response.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }
        if(response.data){
            setTeachers(response.data)
        }
    }

    return (
        <Container>
            <TitlePage>
                <FaChalkboardTeacher/>
                Professores
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
                    placeholder="Pesquisar por nome ou e-mail"
                />
            </InputGroup>
                
                <ModalCreateUpdateTeacher 
                    isOpen={isOpenModalTeacher} 
                    setIsOpen={setIsOpenModalTeacher}
                    fetchTeachers={fetchTeachers}
                >
                    <AddTeacherButtonContainer>
                        <Button
                        colorScheme="blue"
                        variant="solid"
                        onClick={()=>setIsOpenModalTeacher(true)}
                        leftIcon={<FaUserPlus/>}
                        >
                            Cadastrar Professor
                        </Button>
                    </AddTeacherButtonContainer>
                </ModalCreateUpdateTeacher>
            </Toolbar>
            <TeachersTable 
                teachers={teachers}
                fetchTeachers={fetchTeachers}
            />
        </Container>
    );
}

const TeachersTable = ({ teachers, fetchTeachers }: { 
    teachers: ITeacher[],
    fetchTeachers: () => void
}) => {
    const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
    const [isOpenModalTeacher, setIsOpenModalTeacher] = useState(false);
    return ( 
        <TableContainer>
            <Table>
            <Thead>
                <Tr>
                    <TableHeader>
                        Nome
                    </TableHeader>
                    <TableHeader>
                        E-mail
                    </TableHeader>
                    <TableHeader>
                        Departamento
                    </TableHeader>
                    <TableHeader>
                        Status
                    </TableHeader>
                    <TableHeader>
                        
                    </TableHeader>
                </Tr>
            </Thead>
            <Tbody>
            {teachers && teachers.length > 0 ? (
                teachers.map((teacher) => {
                  return (
                    <TableRow
                    selected={selectedTeacher?.id === teacher.id? true : false}
                    onClick={()=>{setSelectedTeacher(teacher)}}
                    key={teacher.id} 
                    >
                        
                        <Td>
                        <NameInfo>
                            {teacher.name}
                        </NameInfo>
                        </Td>
                        <Td>
                        <EmailInfo>
                            {teacher.email}
                        </EmailInfo>
                        </Td>
                        <Td>{teacher.department}</Td>
                        <Td>
                            {teacher.active ? "Ativo" : "Inativo"}
                        </Td>
                        <Td>
                            <ActionButtonsContainer>
                                <ModalCreateUpdateTeacher
                                isOpen={isOpenModalTeacher} 
                                setIsOpen={setIsOpenModalTeacher}
                                fetchTeachers={fetchTeachers}
                                data={teacher}
                                >
                                    <Button
                                    variant={"outline"}
                                    colorScheme="blue"
                                    onClick={()=>setIsOpenModalTeacher(true)}
                                    >
                                        <FaUserEdit/>
                                    </Button>
                                </ModalCreateUpdateTeacher>
                                <ModalDeleteTeacher
                                    data={teacher}
                                    fetchTeachers={fetchTeachers}
                                />
                            </ActionButtonsContainer>
                        </Td>
                        
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <Td colSpan={5}>Nenhuma professor encontrado</Td>
                </TableRow>
              )}
            </Tbody>
            </Table>
        </TableContainer>
    );
}


