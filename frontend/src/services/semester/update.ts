import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ISemester } from '@/interfaces';

type Status = "success" | "error";

interface IUpdateSemesterResponse {
    status: Status;
    message: string;
    data?: ISemester;
}

const updateSemester = async (data: ISemester): Promise<IUpdateSemesterResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        ano: data.year,
        numero: data.number,
        ativo: data.active
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/semestre/${data.id}`,
        method: 'patch',
        data: formattedData
    };

    try {
        const response = await axios<ISemester>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Semestre atualizado com sucesso",
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

export default updateSemester;
