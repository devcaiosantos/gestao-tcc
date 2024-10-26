import axios from 'axios';
import { getCookie } from '@/utils/cookies';

interface IDefineAdvisorAdminProps {
    advisorId: number;
    coAdvisorId?: number;
    enrollmentId: number;
}

interface IDefineAdvisorAdminResponse {
    status: "success" | "error";
    message: string;
}

export type Status = "success" | "error";

const defineAdvisorAdmin = async (data: IDefineAdvisorAdminProps): Promise<IDefineAdvisorAdminResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        idOrientador: data.advisorId,
        idCoOrientador: data?.coAdvisorId,
        idMatricula: data.enrollmentId
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc1/definir-orientador/admin`,
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

export default defineAdvisorAdmin;