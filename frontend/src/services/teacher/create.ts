import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ITeacher } from '@/interfaces';

type Status = "success" | "error";

interface ICreateTeacherResponse {
    status: Status;
    message: string;
    data?: ITeacher;
}

interface ICreateTeacherProps {
    name: string;
    email: string;
    department: string;
}

const createTeacher = async (data: ICreateTeacherProps): Promise<ICreateTeacherResponse> => {
    
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        nome: data.name,
        email: data.email,
        departamento: data.department
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/professor`,
        method: 'post',
        data: formattedData
    };

    try {
        const response = await axios<ITeacher>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Professor cadastrado com sucesso",
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

export default createTeacher;