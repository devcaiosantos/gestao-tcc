import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { IEnrollmentStudent } from '@/interfaces';
import { EnrollmentStatus } from '@/interfaces';

interface AlunoMatriculado {
    id: number;
    raAluno: string;
    etapa: string;
    status: string;
    idSemestre: number;
    idOrientador: number | null;
    idCoorientador: number | null;
    dataCriacao: string;
    dataAtualizacao: string;
    Aluno: {
        nome: string;
        email: string;
    };
    Orientador: {
        nome: string;
    };
    Coorientador: {
        nome: string;
    };
    Banca?: {
        id: number;
        presidenteId: number;
        membros:  {professorId: number, isPresidente: boolean}[]
        local: string;
        dataHorario: string;
    }
}

interface IGetAllEnrollmentStudentsBySemesterResponse {
    status: "success" | "error";
    message: string;
    data?: IEnrollmentStudent[];
}

export type Status = "success" | "error";

interface IFindEnrollmentsProps {
    semesterId: number;
    term: string;
    status:EnrollmentStatus | "todos";
}

const findAllBySemester = async ({semesterId, status, term}:IFindEnrollmentsProps): Promise<IGetAllEnrollmentStudentsBySemesterResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc1?idSemester=${semesterId}&status=${status}&term=${term}`,
        method: 'get'
    };

    try {
        const response = await axios<AlunoMatriculado[]>(config);
        
        const formattedData = response.data.map((enrollmentStudent) => {
            return {
                id: enrollmentStudent.id,
                studentRA: enrollmentStudent.raAluno,
                studentName: enrollmentStudent.Aluno.nome,
                studentEmail: enrollmentStudent.Aluno.email,
                stage: enrollmentStudent.etapa,
                status: enrollmentStudent.status,
                semesterId: enrollmentStudent.idSemestre,
                supervisorId: enrollmentStudent.idOrientador,
                supervisorName: enrollmentStudent.Orientador?.nome,
                coSupervisorId: enrollmentStudent.idCoorientador,
                coSupervisorName: enrollmentStudent.Coorientador?.nome,
                members: enrollmentStudent.Banca?.membros.map(member => member.professorId) || [],
                presidentId: enrollmentStudent.Banca?.membros.find(member => member.isPresidente)?.professorId || 0,
                boardLocal: enrollmentStudent.Banca?.local || null,
                boardDateTime: enrollmentStudent.Banca?.dataHorario? new Date(enrollmentStudent.Banca.dataHorario): null,
                createdAt: new Date(enrollmentStudent.dataCriacao),
                updatedAt: new Date(enrollmentStudent.dataAtualizacao)
            };
        });

        const status: Status = "success";
        return {
            status: status,
            message: "Aluno matriculados encontrados com sucesso",
            data: formattedData
        };
    } catch (error) {
        let message = "Uma falha inesperada ocorreu";

        if (error instanceof Error) {
            message = error.message;
        }

        if (axios.isAxiosError(error)) {
            message = error.response?.data.message || "O servidor pode estar fora do ar, tente novamente mais tarde";
        }

        const status: Status = "error";
        return {
            status: status,
            message: message
        };
    }
};

export default findAllBySemester;