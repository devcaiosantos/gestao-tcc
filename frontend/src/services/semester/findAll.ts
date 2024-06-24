import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ISemester } from '@/interfaces';

interface Semestre {
    id: number;
    ano: number;
    numero: number;
    ativo: boolean;
}

interface IGetAllSemestersResponse {
    status: "success" | "error";
    message: string;
    data?: ISemester[];
}

export type Status = "success" | "error";

const findAllSemesters = async (): Promise<IGetAllSemestersResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/semestre`,
        method: 'get'
    };

    try {
        const response = await axios<Semestre[]>(config);

        const formattedData = response.data.map((semestre) => {
            return {
                id: semestre.id,
                year: semestre.ano,
                number: semestre.numero,
                active: semestre.ativo
            };
        });

        const status: Status = "success";
        return {
            status: status,
            message: "Semestres encontrados com sucesso",
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

export default findAllSemesters;