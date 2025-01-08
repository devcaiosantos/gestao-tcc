import axios from 'axios';
import { getCookie } from '@/utils/cookies';

interface IScheduleBoardAdminResponseProps {
    enrollmentId: number;
    location: string;
    dateTime: string;
}

interface IScheduleBoardAdminResponse {
    status: "success" | "error";
    message: string;
}

type Status = "success" | "error";

const scheduleBoardAdmin = async (data:IScheduleBoardAdminResponseProps): Promise<IScheduleBoardAdminResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        idMatricula: data.enrollmentId,
        local: data.location,
        dataHorario: data.dateTime
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc1/agendar-banca/admin`,
        method: 'post',
        data: formattedData
    };

    try {
        await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Banca agendada com sucesso",
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

export default scheduleBoardAdmin;