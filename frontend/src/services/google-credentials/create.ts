import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { IGoogleCredentials } from '@/interfaces';


interface ICreateGoogleCredentialsResponse {
    status: "success" | "error";
    message: string;
}

export type Status = "success" | "error";

const createGoogleCredentials = async (data: IGoogleCredentials): Promise<ICreateGoogleCredentialsResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/google-credentials`,
        method: 'post',
        data: data
    };

    try {
        const response = await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Cadastro realizado com sucesso",
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

export default createGoogleCredentials;