import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ITeacher } from '@/interfaces';

interface Professor {
    id: number;
    nome: string;
    email: string;
    departamento: string;
    ativo: boolean;
}

interface IGetAllTeachersResponse {
    status: "success" | "error";
    message: string;
    data?: ITeacher[];
}

export type Status = "success" | "error";

const findAllTeachers = async (): Promise<IGetAllTeachersResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/professor`,
        method: 'get'
    };

    try {
        const response = await axios<Professor[]>(config);

        const formattedData = response.data.map((professor) => {
            return {
                id: professor.id,
                name: professor.nome,
                email: professor.email,
                department: professor.departamento,
                active: professor.ativo
            };
        })

        const status: Status = "success";
        return {
            status: status,
            message: "Professores encontrados com sucesso",
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

export default findAllTeachers;
