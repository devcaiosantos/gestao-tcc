import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ISemester } from '@/interfaces';

interface Semestre {
    id: number;
    ano: number;
    numero: number;
    ativo: boolean;
}

interface IGetActiveSemesterResponse {
    status: "success" | "error";
    message: string;
    data?: ISemester;
}

export type Status = "success" | "error";

const findActiveSemester = async (): Promise<IGetActiveSemesterResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/semestre/ativo`,
        method: 'get'
    };

    try {
        const response = await axios<Semestre>(config);

        const formattedData = {
            id: response.data.id,
            year: response.data.ano,
            number: response.data.numero,
            active: response.data.ativo
        }

        const status: Status = "success";
        return {
            status: status,
            message: "Semestre encontrado com sucesso",
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

export default findActiveSemester;