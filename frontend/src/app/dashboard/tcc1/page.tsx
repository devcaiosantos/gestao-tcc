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
import getAllEnrollments from "@/services/enrollment/findAllBySemester";
import { IEnrollmentStudent } from "@/interfaces";

import {
    FlexBox,
    TableContainer,
    TableHeader,
    TableRow,
    EnrollmentInfo,
    AddEnrollmentButtonContainer,
    SearchInput,
    FilterStatusContainer,
    StatusFilterSelect,
    Toolbar,
    Container, 
    ActionButtonsContainer
} from "./style";

import { FaSearch, FaTrash, FaFilter } from "react-icons/fa";
import { 
    InputGroup,
    InputLeftElement,
 } from "@chakra-ui/react";

import ModalCreateEnrollment from "@/components/ModalEnrollment/NewEnrollment";
import ModalCreateBatchEnrollments from "@/components/ModalEnrollment/NewBatchEnrollments";
import { FaUserGraduate, FaEdit, FaUserPlus, FaUsers, FaExclamationCircle, FaMailBulk } from "react-icons/fa";
import { FaDownLong } from "react-icons/fa6";
import useAuthContext from "@/hooks/useAuthContext";

const statusOptions = [
    { value: "todos", label: "Todos", color: "#81e6d9" },
    { value: "matriculado", label: "Matriculado", colorScheme: "#d6bcfa" },
    { value: "orientador_definido", label: "Orientador Definido", colorScheme: "#fbb6ce" },
    { value: "banca_preenchida", label: "Banca Preenchida", colorScheme: "#fbd38d" },
    { value: "banca_agendada", label: "Banca Agendada", colorScheme: "#90cdf4" },
    { value: "aprovado", label: "Aprovado", colorScheme: "#9ae6b4" },
    { value: "reprovado", label: "Reprovado", colorScheme: "#feb2b2" },
    { value: "nao_finalizado", label: "Não Finalizado", colorScheme: "#faf089" }
]

export default function Enrollments() {
    const [enrollments, setEnrollments] = useState<IEnrollmentStudent[]>([])
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(statusOptions[1].value);
    const [selectedEnrollment, setSelectedEnrollment] = useState<IEnrollmentStudent | undefined>();
    const toast = useToast();
    const [isOpenModalEnrollment, setIsOpenModalEnrollment] = useState(false);
    const { activeSemester } = useAuthContext();

    useEffect(() => {
        if(activeSemester){
            fetchEnrollments();
        }
    }, [activeSemester]);

    async function fetchEnrollments() {
        if(!activeSemester) return;
        const response = await getAllEnrollments(activeSemester.id); 
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
            setEnrollments(response.data);
        }
    }

    if(!activeSemester) {
        return (
            <Container>
                <TitlePage>
                    <FaUserGraduate/>
                    Matrículas TCC 1
                </TitlePage>
                <Divider mb={"10px"}/>
                <FlexBox>
                    <h3>Não foi possível encontrar o semestre ativo</h3>
                </FlexBox>
            </Container>
        );
    }
       
    return (
        <Container>
            <TitlePage>
                <FaUserGraduate/>
                Matrículas TCC 1 - {activeSemester?.year}/{activeSemester?.number}
                <Button
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<FaExclamationCircle/>}
                >
                    Finalizar Semestre
                </Button>
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
                        placeholder="Pesquisar por nome ou RA"
                    />
                </InputGroup>
                <FilterStatusContainer>
                    <FaFilter/>
                    <StatusFilterSelect
                        colorScheme={"red"}
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        width={"200px"}
                        color={
                            statusOptions.find((status) => status.value === selectedStatusFilter)?.colorScheme
                        }
                    >
                        {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </StatusFilterSelect>
                </FilterStatusContainer>
            </Toolbar> 
            <Toolbar>
                <AddEnrollmentButtonContainer>
                    <ModalCreateEnrollment fetchEnrollments={fetchEnrollments}/>
                    <ModalCreateBatchEnrollments fetchEnrollments={fetchEnrollments}/>
                    <Button
                        colorScheme="yellow"
                        variant="outline"
                        leftIcon={<FaDownLong/>}
                    >
                        Importar Matrículas
                    </Button>
                    <Button
                        colorScheme="cyan"
                        variant="outline"
                        leftIcon={<FaMailBulk/>}
                    >
                        Enviar E-mails
                    </Button>
                </AddEnrollmentButtonContainer>
                
            </Toolbar>
            <EnrollmentsTable 
                enrollments={enrollments}
                fetchEnrollments={fetchEnrollments}
                selectedEnrollment={selectedEnrollment}
                setSelectedEnrollment={setSelectedEnrollment}
            />
        </Container>
    );
}

const EnrollmentsTable = ({ 
    enrollments, fetchEnrollments,
    selectedEnrollment, setSelectedEnrollment 
}: { 
    enrollments: IEnrollmentStudent[],
    fetchEnrollments: () => void,
    selectedEnrollment?: IEnrollmentStudent,
    setSelectedEnrollment: (enrollment: IEnrollmentStudent) => void
}) => {
    const [isOpenModalEnrollment, setIsOpenModalEnrollment] = useState(false);

    function handleEditClick(){
        setIsOpenModalEnrollment(true);
    }

    return ( 
        <>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <TableHeader>
                                RA
                            </TableHeader>
                            <TableHeader>
                                Nome
                            </TableHeader>
                            <TableHeader>
                                Status
                            </TableHeader>
                            <TableHeader>
                                Orientador
                            </TableHeader>
                            <TableHeader>
                                
                            </TableHeader>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {enrollments && enrollments.length > 0 ? (
                        enrollments.map((enrollment) => {
                          return (
                            <TableRow
                                selected={selectedEnrollment?.id === enrollment.id ? true : false}
                                onClick={() => {setSelectedEnrollment(enrollment)}}
                                key={enrollment.id} 
                            >
                                <Td>
                                    {enrollment.studentRA}
                                </Td>
                                <Td>
                                    <EnrollmentInfo>
                                        {enrollment.studentName}
                                    </EnrollmentInfo>
                                </Td>
                                <Td>
                                    {enrollment.status?.toUpperCase()}
                                </Td>
                                <Td>
                                    {enrollment.supervisorName?.toUpperCase()}
                                </Td>
                                <Td>
                                    <ActionButtonsContainer>
                                        <Button
                                            variant={"outline"}
                                            colorScheme="blue"
                                        >
                                            <FaEdit/>
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                            colorScheme="red"
                                        >
                                            <FaTrash/>
                                        </Button>
                                    </ActionButtonsContainer>
                                </Td>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <Td colSpan={4}>Nenhuma matrícula encontrada</Td>
                        </TableRow>
                      )}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
}
