import axios from 'axios';
import { getCookie } from '@/utils/cookies';

interface IAssignGradeProps {
    enrollmentId: number;
    grade: number;
}

interface IAssignGradeResponse {
    status: "success" | "error";
    message: string;
}

type Status = "success" | "error";

const assignGrade = async (data:IAssignGradeProps): Promise<IAssignGradeResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        idMatricula: data.enrollmentId,
        nota: data.grade
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc/atribuir-nota`,
        method: 'post',
        data: formattedData
    };

    try {
        await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Nota atribuída com sucesso",
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

export default assignGrade;