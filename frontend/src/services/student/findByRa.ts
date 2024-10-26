import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { IStudent } from '@/interfaces';

interface Aluno {
    ra: string;
    nome: string;
    email: string;
}

interface IFindStudentByRAResponse {
    status: "success" | "error";
    message: string;
    data?: IStudent;
}

export type Status = "success" | "error";

const findStudentByRA = async (term:string): Promise<IFindStudentByRAResponse > => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/aluno/ra/${term}`,
        method: 'get'
    };

    try {
        const response = await axios<Aluno>(config);
        const formattedData = {
            name: response.data.nome,
            email: response.data.email,
            ra: response.data.ra
        }
        const status: Status = "success";
        return {
            status: status,
            message: "Aluno encontrado com sucesso",
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

export default findStudentByRA;
