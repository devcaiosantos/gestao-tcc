import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { IEnrollmentStudent } from '@/interfaces';

interface ICreateEnrollmentProps {
    name: string;
    email: string;
    ra: string;
}

interface ICreateEnrollmentResponse {
    status: "success" | "error";
    message: string;
    data?: IEnrollmentStudent;
}

export type Status = "success" | "error";

const createEnrollment = async (data: ICreateEnrollmentProps): Promise<ICreateEnrollmentResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        nome: data.name,
        email: data.email,
        ra: data.ra
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc1/matricular`,
        method: 'post',
        data: formattedData
    };

    try {
        const response = await axios<IEnrollmentStudent>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Aluno matriculado com sucesso",
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

export default createEnrollment;