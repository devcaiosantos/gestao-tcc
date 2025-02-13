import axios, { AxiosError } from 'axios';

interface IAuthProps {
    email: string;
    password: string;
}

interface SuccessResponse {
    id: number;
    email: string;
    nome: string;
    emailSistema?: string;
    chaveEmailSistema?: string;
    idCalendario?: string;
    access_token: string;
    expires_in: number;
}

interface IAuthResponse {
    status: "success" | "error";
    message: string;
    data?: SuccessResponse;
}

export type Status = "success" | "error";

const auth = async (data: IAuthProps): Promise<IAuthResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        email: data.email,
        senha: data.password
    };

    try {
        const response = await axios.post<SuccessResponse>(URL + "/auth", formattedData);
        const status: Status = "success";
        return {
            status: status,
            message: "Login realizado com sucesso",
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

export default auth;
