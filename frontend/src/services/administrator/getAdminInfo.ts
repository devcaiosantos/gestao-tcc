import axios from 'axios';
import { getCookie } from '@/utils/cookies';

interface SuccessResponse {
    id: number;
    nome: string;
    email: string;
    email_sistema: string;
    senha_email_sistema: string;
}

interface IGetAdminResponse {
    status: "success" | "error";
    message: string;
    data?: SuccessResponse;
}

export type Status = "success" | "error";

const getAdminInfo = async (id: number): Promise<IGetAdminResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/administrador/${id}`,
        method: 'get'
    };

    try {
        const response = await axios<SuccessResponse>(config);
        const status: Status = "success";
        return {
            status: status,
            message: "Administrador encontrado com sucesso",
            data: response.data
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

export default getAdminInfo;
