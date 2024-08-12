import axios from 'axios';
import { getCookie } from '@/utils/cookies';

interface IDefineAdvisorStudentProps {
    advisorId: number;
    coAdvisorId?: number;
    token: string;
}

interface IDefineAdvisorStudentResponse {
    status: "success" | "error";
    message: string;
}

export type Status = "success" | "error";

const defineAdvisorStudent= async (data: IDefineAdvisorStudentProps): Promise<IDefineAdvisorStudentResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        token: data.token,
        idOrientador: data.advisorId,
        idCoOrientador: data?.coAdvisorId,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        url: URL + `/tcc1/definir-orientador/aluno`,
        method: 'post',
        data: formattedData
    };

    try {
        await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Orientador definido com sucesso",
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

export default defineAdvisorStudent;