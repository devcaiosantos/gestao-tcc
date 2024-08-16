import axios, { AxiosError } from 'axios';

interface IValidateStudentTokenProps {
    status: string;
    token: string;
}

interface IValidateStudentTokenResponse {
    status: "success" | "error";
    message: string;
}

export type Status = "success" | "error";

const validateStudentToken = async (data: IValidateStudentTokenProps): Promise<IValidateStudentTokenResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        status: data.status,
        token: data.token
    };

    try {
        await axios.post(URL + "/validar-token-aluno", formattedData);
        const status: Status = "success";
        return {
            status: status,
            message: "Token validado com sucesso"
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

export default validateStudentToken;
