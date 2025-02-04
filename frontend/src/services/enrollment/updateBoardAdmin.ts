import axios from 'axios';
import { getCookie } from '@/utils/cookies';

interface IUpdateBoardAdminProps {
    title: string;
    enrollmentId: number;
    memberIds: number[];
}

interface IUpdateBoardAdminResponse {
    status: "success" | "error";
    message: string;
}

type Status = "success" | "error";

const updateBoardAdmin = async (data: IUpdateBoardAdminProps): Promise<IUpdateBoardAdminResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        titulo: data.title,
        idMatricula: data.enrollmentId,
        idMembros: data.memberIds
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc/alterar-banca/admin`,
        method: 'put',
        data: formattedData
    };

    try {
        await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Banca alterada com sucesso",
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

export default updateBoardAdmin;