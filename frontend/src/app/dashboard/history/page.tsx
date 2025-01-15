"use client"
import { Container, 
    HistoryContainer, 
    HistoryItem, 
    Observation,
    StudentInfo
} from "./style";
import { TitlePage } from "../style";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import findAllHistoryByRa from "@/services/history/findAll";
import findStudentByRA from "@/services/student/findByRa";
import { IHistory } from "@/interfaces";
import { useSearchParams } from "next/navigation";
import { IStudent } from "@/interfaces";

export default function Page(){
    const [history, setHistory] = useState<IHistory[]>([]);
    const [student, setStudent] = useState<IStudent>();
    const toast = useToast();

    const searchParams = useSearchParams();
    const ra = searchParams.get("ra");

    useEffect(() => {
        if(!ra){
            toast({
                title: "RA não informado",
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }
        fetchData(ra);
    }, []);
    

    async function fetchData(data:string){
        const [resStudent, resHistory] = await Promise.all([
            findStudentByRA(data),
            findAllHistoryByRa(data)
        ]);

        if(resStudent.status === "error"){
            toast({
                title: "Erro ao buscar aluno",
                description: resStudent.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }

        setStudent(resStudent.data);

        if(resHistory.status === "error"){
            toast({
                title: "Erro ao buscar histórico",
                description: resHistory.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }
        if(resHistory.data){
            setHistory(resHistory.data.reverse());
        }
        

    }

    return (
        <Container>
        <TitlePage>Historico - {student && student.name}</TitlePage>
            {student && (
                <StudentInfo>
                  <p><strong>RA:</strong> {student.ra}</p>
                  <p><strong>E-mail:</strong> {student.email}</p>
                </StudentInfo>
            )}
        <HistoryContainer>
                {history.length === 0 ? (
                    <p>No history found.</p>
                ) : (
                    history.map((item) => (
                        <HistoryItem key={item.id}>
                            <div className="status">
                                <strong>Status:</strong> {item.status.replace("_", " ").toUpperCase()}
                            </div>
                            <div className="stage">
                                <strong>Etapa:</strong> {item.stage}
                            </div>
                            <Observation>
                                <strong>Observação:</strong> {item.observation || "Nenhuma observação"}
                            </Observation>
                            <div className="date">
                                <strong>Data e Horário:</strong> {new Date(item.createdAt).toLocaleString()}
                            </div>
                        </HistoryItem>
                    ))
                )}
            </HistoryContainer>
        </Container>
    );
};