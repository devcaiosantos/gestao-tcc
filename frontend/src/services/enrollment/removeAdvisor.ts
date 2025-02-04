import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { IEnrollmentStudent } from '@/interfaces';

interface IRemoveAdvisorResponse {
    status: "success" | "error";
    message: string;
    data?: IEnrollmentStudent;
}

export type Status = "success" | "error";

const removeAdvisor = async (enrollmentId: number): Promise<IRemoveAdvisorResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc/remover-orientador/${enrollmentId}`,
        method: 'delete',
    };

    try {
        await axios<IEnrollmentStudent>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Orientador removido com sucesso",
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

export default removeAdvisor;