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
} from "@chakra-ui/react";
import { TitlePage } from "../style";
import { Container, ActionButtonsContainer } from "./style";
import getAllSemesters from "@/services/semester/findAll";
import { ISemester } from "@/interfaces";
import {
    FlexBox,
    TableContainer,
    TableHeader,
    TableRow,
    SemesterInfo,
    AddSemesterButtonContainer,
    Toolbar
} from "./style";
import ModalCreateUpdateSemester from "@/components/ModalSemester/CreateUpdate"
import ModalDeleteSemester from "@/components/ModalSemester/Delete";
import { FaCalendarAlt, FaEdit } from "react-icons/fa";

export default function Semesters() {
    const [semesters, setSemesters] = useState<ISemester[]>([]);
    const toast = useToast();
    const [isOpenModalSemester, setIsOpenModalSemester] = useState(false);

    useEffect(() => {
        fetchSemesters();
    }, []);

    async function fetchSemesters() {
        const response = await getAllSemesters();  
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
            setSemesters(response.data)
        }
    }

    return (
        <Container>
            <TitlePage>
                <FaCalendarAlt/>
                Semestres
            </TitlePage>
            <Divider mb={"10px"}/>
            <Toolbar>
                <ModalCreateUpdateSemester 
                    isOpen={isOpenModalSemester} 
                    setIsOpen={setIsOpenModalSemester}
                    fetchSemesters={fetchSemesters}
                >
                    <AddSemesterButtonContainer>
                        <Button
                        colorScheme="blue"
                        variant="solid"
                        onClick={()=>setIsOpenModalSemester(true)}
                        leftIcon={<FaCalendarAlt/>}
                        >
                            Cadastrar Semestre
                        </Button>
                    </AddSemesterButtonContainer>
                </ModalCreateUpdateSemester>
            </Toolbar>
            <SemestersTable 
                semesters={semesters}
                fetchSemesters={fetchSemesters}
            />
        </Container>
    );
}

const SemestersTable = ({ semesters, fetchSemesters }: { 
    semesters: ISemester[],
    fetchSemesters: () => void
}) => {
    const [selectedSemester, setSelectedSemester] = useState<ISemester | undefined>();
    const [isOpenModalSemester, setIsOpenModalSemester] = useState(false);

    function handleEditClick(){
        setIsOpenModalSemester(true);
    }

    return ( 
        <>
            <ModalCreateUpdateSemester
                isOpen={isOpenModalSemester} 
                setIsOpen={setIsOpenModalSemester}
                fetchSemesters={fetchSemesters}
                data={selectedSemester}
            />
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <TableHeader>
                                Ano
                            </TableHeader>
                            <TableHeader>
                                Número
                            </TableHeader>
                            <TableHeader>
                                Status
                            </TableHeader>
                            <TableHeader>
                                
                            </TableHeader>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {semesters && semesters.length > 0 ? (
                        semesters.map((semester) => {
                          return (
                            <TableRow
                                selected={selectedSemester?.id === semester.id ? true : false}
                                onClick={() => {setSelectedSemester(semester)}}
                                key={semester.id} 
                            >
                                <Td>
                                    <SemesterInfo>
                                        {semester.year}
                                    </SemesterInfo>
                                </Td>
                                <Td>
                                    <SemesterInfo>
                                        {semester.number}
                                    </SemesterInfo>
                                </Td>
                                <Td>
                                    {semester.active ? "Ativo" : "Inativo"}
                                </Td>
                                <Td>
                                    <ActionButtonsContainer>
                                        <Button
                                            variant={"outline"}
                                            colorScheme="blue"
                                            onClick={handleEditClick}
                                        >
                                            <FaEdit/>
                                        </Button>
                                        <ModalDeleteSemester
                                            data={semester}
                                            fetchSemesters={fetchSemesters}
                                        />
                                    </ActionButtonsContainer>
                                </Td>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <Td colSpan={4}>Nenhum semestre encontrado</Td>
                        </TableRow>
                      )}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
}
