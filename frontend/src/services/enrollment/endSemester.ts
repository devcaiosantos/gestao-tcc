import axios from 'axios';
import { getCookie } from '@/utils/cookies';

type Status = "success" | "error";

interface IEndSemesterResponse {
    status: Status;
    message: string;
}

const endSemester = async ({semesterId, stage}: {
    semesterId: number,
    stage: "TCC1" | "TCC2"
}): Promise<IEndSemesterResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc/finalizar-semestre/${stage}/${semesterId}`,
        method: 'put'
    };

    try {
        await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Matrículas atualizadas com sucesso"
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

export default endSemester;
