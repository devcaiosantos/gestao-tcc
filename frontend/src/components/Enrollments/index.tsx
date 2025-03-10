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
    Tooltip
} from "@chakra-ui/react";
import { TitlePage } from "@/app/dashboard/style";
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
    ActionButtonsContainer,
    StatusBoxValue
} from "./style";

import { FaSearch, FaFilter, FaHistory } from "react-icons/fa";

import { 
    InputGroup,
    InputLeftElement,
 } from "@chakra-ui/react";

import ModalCreateEnrollment from "@/components/ModalEnrollment/NewEnrollment";
import ModalCreateBatchEnrollments from "@/components/ModalEnrollment/NewBatchEnrollments";
import ModalUnenroll from "@/components/ModalEnrollment/Unenroll";
import ModalEndSemester from "@/components/ModalEndSemester";
import ModalImportEnrollments from "@/components/ModalImportEnrollments";
import ModalDefineAdvisorAdmin from "@/components/ModalDefineAdvisorAdmin";
import ModalSendEmails from "@/components/ModalSendEmails";
import ModalRemoveAdvisor from "@/components/ModalRemoveAdvisor";
import ModalDefineBoard from "@/components/ModalDefineBoard/Create";
import ModalUpdateBoard from "@/components/ModalDefineBoard/Update";
import ModalRemoveBoard from "@/components/ModalRemoveBoard";
import ModalScheduleBoard from "@/components/ModalScheduleBoard";
import ModalUnscheduleBoard from "@/components/ModalUnscheduleBoard";
import ModalShowEnrollment from "@/components/ModalShowEnrollment";
import ModalGenerateATA from "@/components/ModalGenerateATA";
import ModalAssignGrade from "@/components/ModalAssignGrade";
import ModalRemoveGrade from "@/components/ModalRemoveGrade";

import { FaUserGraduate } from "react-icons/fa";
import useAuthContext from "@/hooks/useAuthContext";
import useDebounce from "@/hooks/useDebounce";
import { statusOptions } from "@/utils/statusOptions";

export default function Enrollments({stage}: {stage: "TCC1" | "TCC2"}) {
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
            stage: stage,
            semesterId: activeSemester.id,
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
                    Matrículas {stage} 
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
                Matrículas {stage} - {activeSemester?.year}/{activeSemester?.number}
                <ModalEndSemester
                    stage={stage}
                    data={activeSemester}
                    fetchEnrollments={fetchEnrollments}
                />
            </TitlePage>
            <Divider mb={"10px"}/>
            <Toolbar1>
                <AddEnrollmentButtonContainer>
                    <ModalCreateEnrollment stage={stage} fetchEnrollments={fetchEnrollments}/>
                    <ModalCreateBatchEnrollments stage={stage} fetchEnrollments={fetchEnrollments}/>
                </AddEnrollmentButtonContainer>
                <AddEnrollmentButtonContainer>
                    <ModalImportEnrollments stage={stage} fetchEnrollments={fetchEnrollments}/>
                    <ModalSendEmails stage={stage}/>
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
                                <Td >
                                    <StatusBoxValue 
                                    $bgColor={statusOptions.find((status) => status.value === enrollment.status)?.colorScheme || "gray"}
                                    >
                                        {enrollment.status?.toUpperCase().replace("_", "_")}
                                    </StatusBoxValue>
                                </Td>
                                <Td>
                                    {enrollment.supervisorName?.toUpperCase()}
                                </Td>
                                <Td>
                                    <ActionButtonsContainer>
                                        {
                                            enrollment.status === "orientador_definido" &&
                                            <ModalRemoveAdvisor 
                                                data={enrollment}
                                                fetchEnrollments={fetchEnrollments}   
                                            />
                                        }
                                        
                                        {
                                            enrollment.status === "matriculado" &&
                                            <ModalDefineAdvisorAdmin
                                                enrollmentId={enrollment.id}
                                                fetchEnrollments={fetchEnrollments}
                                            />
                                        }

                                        {
                                            enrollment.status === "orientador_definido" &&
                                            <ModalDefineBoard
                                                data={enrollment}
                                                fetchEnrollments={fetchEnrollments}
                                            />
                                        }
                                            
                                        {
                                            enrollment.status === "banca_preenchida" &&
                                            <>
                                                <ModalRemoveBoard
                                                    data={enrollment}
                                                    fetchEnrollments={fetchEnrollments}
                                                />
                                                <ModalUpdateBoard
                                                    data={enrollment}
                                                    fetchEnrollments={fetchEnrollments}
                                                 />
                                                 <ModalScheduleBoard
                                                    enrollment={enrollment}
                                                    fetchEnrollments={fetchEnrollments}
                                                 />
                                            </>
                                        }

                                        {
                                            enrollment.status === "banca_agendada" &&
                                            <>
                                                <ModalUnscheduleBoard
                                                    data={enrollment}
                                                    fetchEnrollments={fetchEnrollments}
                                                />
                                                <ModalGenerateATA 
                                                    data={enrollment}
                                                />
                                                <ModalAssignGrade
                                                    data={enrollment}
                                                    fetchEnrollments={fetchEnrollments}
                                                />
                                            </>
                                        }

                                        {
                                            (
                                                enrollment.status === "aprovado" ||
                                                enrollment.status === "reprovado"  
                                            )
                                             &&
                                            <ModalRemoveGrade 
                                                data={enrollment}
                                                fetchEnrollments={fetchEnrollments}
                                            />
                                        }

                                        <ModalShowEnrollment 
                                            data={enrollment}
                                        />
                                        <Tooltip label="Histórico Aluno">
                                          <a href={`/dashboard/history?ra=${enrollment.studentRA}`} target="_blank">
                                            <Button
                                                    colorScheme="blue"
                                                    variant={"outline"}
                                            >
                                                <FaHistory/>
                                            </Button>
                                          </a>
                                        </Tooltip>
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
