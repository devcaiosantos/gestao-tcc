import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { IEnrollmentStudent } from '@/interfaces';

interface ICreateBatchEnrollmentProps {
    stage: "TCC1" | "TCC2";
    data: {
        name: string;
        email: string;
        ra: string;
    }[];
}

interface ICreateBatchEnrollmentResponse {
    status: "success" | "error";
    message: string;
    data?: IEnrollmentStudent[];
}

export type Status = "success" | "error";

const createBatchEnrollment = async ({stage, data}:ICreateBatchEnrollmentProps): Promise<ICreateBatchEnrollmentResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = data.map((enrollment) => {
        return {
            nome: enrollment.name,
            email: enrollment.email,
            ra: enrollment.ra
        };
    });

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/tcc/${stage}/matricular-lote`,
        method: 'post',
        data: formattedData
    };

    try {
        await axios<IEnrollmentStudent[]>(config);
        const status: Status = "success";
        return {
            status: status,
            message: "Alunos matriculados com sucesso"
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

export default createBatchEnrollment;