import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ITeacher } from '@/interfaces';

type Status = "success" | "error";

interface IDeleteTeacherResponse {
    status: Status;
    message: string;
    data?: ITeacher;
}

const deleteTeacher = async (id: number): Promise<IDeleteTeacherResponse> => {
    
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/professor/${id}`,
        method: 'delete'
    };

    try {
        const response = await axios<ITeacher>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Professor deletado com sucesso",
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

export default deleteTeacher;