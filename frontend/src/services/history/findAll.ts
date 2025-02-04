import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { IHistory, EnrollmentStatus } from '@/interfaces';

interface IFindAllHistoryResponse {
    status: "success" | "error";
    message: string;
    data?: IHistory[];
}

interface Historico {
    id: number;
    raAluno: string;
    idSemestre: number;
    status: EnrollmentStatus;
    etapa: string;
    observacao: string;
    dataCriacao: string;
}

export type Status = "success" | "error";

const findAllHistoryByRa = async (ra: string): Promise<IFindAllHistoryResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/historico/${ra}`,
        method: 'get'
    };

    try {
        const response = await axios<Historico[]>(config);

        const formattedData = response.data.map((history) => {
            return {
                id: history.id,
                studentRA: history.raAluno,
                semesterId: history.idSemestre,
                status: history.status,
                stage: history.etapa,
                observation: history.observacao,
                createdAt: new Date(history.dataCriacao),
            };
            
        })

        const status: Status = "success";
        return {
            status: status,
            message: "Histórico encontrado com sucesso",
            data: formattedData
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

export default findAllHistoryByRa;