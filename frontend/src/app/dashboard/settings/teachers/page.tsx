"use client"
import { useState, useEffect } from "react";
import { 
    Divider, 
    useToast,
    NumberDecrementStepper, 
    NumberIncrementStepper, 
    NumberInputField, 
    NumberInputStepper,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    useDisclosure,
    Button,
    Flex
} from "@chakra-ui/react";
import { TitlePage } from "../../style";
import { Container, ActionButtonsContainer } from "./style";
import { FaChalkboardTeacher } from "react-icons/fa";
import getAllTeachers from "@/services/teacher/findAll";
import { ITeacher } from "@/interfaces";
import {
    PaginationContainer,
    FlexBox,
    NumberInputStyled,
    TableContainer,
    TableHeader,
    TableRow,
    NameInfo,
    EmailInfo,
    AddTeacherButtonContainer
} from "./style"
import ModalCreateUpdateTeacher from "@/components/ModalTeacher/CreateUpdate";
import ModalDeleteTeacher from "@/components/ModalTeacher/Delete";
import { FaUserPlus, FaUserEdit } from "react-icons/fa";

export default function Teachers() {
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const toast = useToast();
    const [isOpenModalTeacher, setIsOpenModalTeacher] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(teachers.length / 10));
    }, [teachers]);

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

    return (
        <Container>
            <TitlePage>
                <FaChalkboardTeacher/>
                Professores
            </TitlePage>
            <Divider mb={"10px"}/>
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
            <TeachersTable 
                teachers={teachers}
                isOpenModalTeacher={isOpenModalTeacher} 
                setIsOpenModalTeacher={setIsOpenModalTeacher}
                fetchTeachers={fetchTeachers}
            />
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            >
            </Pagination>
        </Container>
    );
}

const TeachersTable = ({ teachers, isOpenModalTeacher, setIsOpenModalTeacher, fetchTeachers }: { 
    teachers: ITeacher[],
    isOpenModalTeacher: boolean,
    setIsOpenModalTeacher: (value: boolean) => void,
    fetchTeachers: () => void
}) => {
    const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
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
                            {
                                (selectedTeacher && selectedTeacher?.id == teacher.id)
                                && 
                                (
                                    <ActionButtonsContainer>
                                        <ModalCreateUpdateTeacher
                                        isOpen={isOpenModalTeacher} 
                                        setIsOpen={setIsOpenModalTeacher}
                                        fetchTeachers={fetchTeachers}
                                        data={teacher}
                                        >
                                            <Button
                                            colorScheme="blue"
                                            leftIcon={<FaUserEdit/>}
                                            onClick={()=>setIsOpenModalTeacher(true)}
                                            >
                                                Editar
                                            </Button>
                                        </ModalCreateUpdateTeacher>
                                        <ModalDeleteTeacher
                                            data={teacher}
                                            fetchTeachers={fetchTeachers}
                                        />
                                    </ActionButtonsContainer>
                                )
                            }
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

interface PaginationProps {
    currentPage: number;
    setCurrentPage: (value: number) => void;
    totalPages: number;
}
export const Pagination = ({ currentPage, setCurrentPage, totalPages }:PaginationProps) => (
    <PaginationContainer>
        <FlexBox>
            Página
            <NumberInputStyled value={currentPage} onChange={(value) => setCurrentPage(Number(value))} min={1} max={totalPages}>
                <NumberInputField />
                <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInputStyled>
            de {totalPages}
            </FlexBox>
            <FlexBox>
        </FlexBox>
  </PaginationContainer>
  );
