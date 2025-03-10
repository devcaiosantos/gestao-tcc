import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { url } from 'inspector';

interface IUpdateAdminProps {
    id: number;
    name: string;
    email: string;
    systemEmail?: string;
    systemEmailKey?: string;
    calendarId?: string;
}

interface SuccessResponse {
    id: number;
    nome: string;
    email: string;
    emailSistema: string;
    chaveEmailSistema: string;
    idCalendario: string;
}

interface IUpdateAdminResponse {
    status: "success" | "error";
    message: string;
    data?: SuccessResponse;
}

export type Status = "success" | "error";

const updateAdminInfo = async (data: IUpdateAdminProps): Promise<IUpdateAdminResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        nome: data.name,
        email: data.email,
        emailSistema: data.systemEmail,
        chaveEmailSistema: data.systemEmailKey,
        idCalendario: data.calendarId
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/administrador/${data.id}`,
        method: 'patch',
        data: formattedData
    };

    try {
        const response = await axios<SuccessResponse>(config);
        const status: Status = "success";
        return {
            status: status,
            message: "Informações atualizadas com sucesso",
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

export default updateAdminInfo;
