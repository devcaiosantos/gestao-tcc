import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { url } from 'inspector';

interface IResetPasswordProps {
    id: number;
    currentPassword: string;
    newPassword: string;    
}

interface SuccessResponse {
    id: number;
    nome: string;
    email: string;
}

interface IResetPasswordResponse {
    status: "success" | "error";
    message: string;
    data?: SuccessResponse;
}

export type Status = "success" | "error";

const resetPassword = async (data: IResetPasswordProps): Promise<IResetPasswordResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        senha: data.currentPassword,
        novaSenha: data.newPassword
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/administrador/${data.id}/reset-password`,
        method: 'patch',
        data: formattedData
    };

    try {
        const response = await axios<SuccessResponse>(config);
        const status: Status = "success";
        return {
            status: status,
            message: "Senha atualizada com sucesso",
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

export default resetPassword;
