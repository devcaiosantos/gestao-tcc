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
import { IEnrollmentStudent, EnrollmentStatus } from "@/interfaces";

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
    Toolbar1,
    Toolbar2,
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
import ModalUnenroll from "@/components/ModalEnrollment/Unenroll";
import ModalEndSemester from "@/components/ModalEndSemester";
import ModalImportEnrollments from "@/components/ModalImportEnrollments";
import { FaUserGraduate, FaEdit, FaExclamationCircle, FaMailBulk } from "react-icons/fa";
import useAuthContext from "@/hooks/useAuthContext";
import useDebounce from "@/hooks/useDebounce";
interface IStatusOptions {
    value: EnrollmentStatus | "todos";
    label: string;
    colorScheme: string;
}

const statusOptions: IStatusOptions[] = [
    { value: "todos", label: "Todos", colorScheme: "#81e6d9" },
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
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<EnrollmentStatus | "todos">(statusOptions[1].value);
    const [selectedEnrollment, setSelectedEnrollment] = useState<IEnrollmentStudent | undefined>();
    const toast = useToast();
    const { activeSemester } = useAuthContext();
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if(activeSemester){
            fetchEnrollments();
        }
    }, [activeSemester]);

    useEffect(() => {
        fetchEnrollments();
    },[debouncedSearchTerm, selectedStatusFilter, activeSemester]);

    async function fetchEnrollments() {
        if(!activeSemester) return;
        const response = await getAllEnrollments({
            idSemester: activeSemester.id,
            status: selectedStatusFilter,
            term: searchTerm
        }); 
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
                <ModalEndSemester
                    data={activeSemester}
                    fetchEnrollments={fetchEnrollments}
                />
            </TitlePage>
            <Divider mb={"10px"}/>
            <Toolbar1>
                <AddEnrollmentButtonContainer>
                    <ModalCreateEnrollment fetchEnrollments={fetchEnrollments}/>
                    <ModalCreateBatchEnrollments fetchEnrollments={fetchEnrollments}/>
                </AddEnrollmentButtonContainer>
                <AddEnrollmentButtonContainer>
                    <ModalImportEnrollments fetchEnrollments={fetchEnrollments}/>
                    <Button
                        colorScheme="cyan"
                        variant="outline"
                        leftIcon={<FaMailBulk/>}
                    >
                        Enviar E-mails
                    </Button>
                </AddEnrollmentButtonContainer>
            </Toolbar1>
            <Toolbar2>
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
                        onChange={(e) => setSelectedStatusFilter(e.target.value as EnrollmentStatus | "todos")}
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
            </Toolbar2> 
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
                                        <ModalUnenroll
                                            enrollment={enrollment}
                                            fetchEnrollments={fetchEnrollments}
                                        />
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
