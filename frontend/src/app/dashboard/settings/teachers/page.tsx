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
    Button
} from "@chakra-ui/react";
import { TitlePage } from "../../style";
import { Container } from "./style";
import { FaChalkboardTeacher } from "react-icons/fa";
import getAllTeachers from "@/services/teacher/getAllTeachers";
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
import ModalTeacher from "@/components/ModalTeacher";
import { FaUserPlus } from "react-icons/fa";

export default function Teachers() {
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const toast = useToast();
    const [isOpenAddTeacherModal, setIsOpenAddTeacherModal] = useState(false);

    useEffect(() => {
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
        fetchTeachers();
    }, [toast]);

    useEffect(() => {
        setTotalPages(Math.ceil(teachers.length / 10));
    }, [teachers]);

    return (
        <Container>
            <TitlePage>
                <FaChalkboardTeacher/>
                Professores
            </TitlePage>
            <Divider mb={"10px"}/>
            <ModalTeacher 
                isOpen={isOpenAddTeacherModal} 
                setIsOpen={setIsOpenAddTeacherModal}
            >
                <AddTeacherButtonContainer>
                    <Button
                    colorScheme="blue"
                    variant="solid"
                    onClick={()=>setIsOpenAddTeacherModal(true)}
                    leftIcon={<FaUserPlus/>}
                    >
                        Cadastrar Professor
                    </Button>
                </AddTeacherButtonContainer>
            </ModalTeacher>
            <TeachersTable teachers={teachers}/>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            >
            </Pagination>
        </Container>
    );
}

const TeachersTable = ({ teachers }: { teachers: ITeacher[] }) => {
    
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
                </Tr>
            </Thead>
            <Tbody>
            {teachers && teachers.length > 0 ? (
                teachers.map((teacher) => {
                  return (
                    <TableRow 
                    // onClick={()=>{setIsOpenMessageModal(true),setSelectedMessage(message)}}
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
