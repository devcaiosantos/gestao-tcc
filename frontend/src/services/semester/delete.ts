import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ISemester } from '@/interfaces';

type Status = "success" | "error";

interface IDeleteSemesterResponse {
    status: Status;
    message: string;
    data?: ISemester;
}

const deleteSemester = async (id: number): Promise<IDeleteSemesterResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/semestre/${id}`,
        method: 'delete'
    };

    try {
        const response = await axios<ISemester>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Semestre deletado com sucesso",
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

export default deleteSemester;