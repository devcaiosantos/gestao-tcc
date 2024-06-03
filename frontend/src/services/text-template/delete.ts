import axios from "axios";
import { getCookie } from "@/utils/cookies";
import { ITextTemplate } from "@/interfaces";

type Status = "success" | "error";

interface IDeleteTextTemplateResponse {
    status: Status;
    message: string;
    data?: ITextTemplate;
}

interface ModeloTexto {
    id: number;
    titulo: string;
    conteudo: string;
    tipo: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

const deleteTextTemplate = async (id: number): Promise<IDeleteTextTemplateResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/text-template/${id}`,
        method: 'delete'
    };

    try {
        const response = await axios<ModeloTexto>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Modelo de texto deletado com sucesso",
            data: {
                id: response.data.id,
                title: response.data.titulo,
                content: response.data.conteudo,
                type: response.data.tipo,
                createdAt: response.data.dataCriacao,
                updatedAt: response.data.dataAtualizacao
            }
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