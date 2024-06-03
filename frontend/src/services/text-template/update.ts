import axios from "axios";
import { getCookie } from "@/utils/cookies";
import { ITextTemplate } from "@/interfaces";


interface ModeloTexto {
    id: number;
    titulo: string;
    conteudo: string;
    tipo: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

type Status = "success" | "error";

interface IUpdateTextTemplateResponse {
    status: Status;
    message: string;
    data?: ITextTemplate;
}

interface IUpdateTextTemplateProps {
    id: number;
    title: string;
    content: string;
    type: string;
}

const updateTextTemplate = async (data: IUpdateTextTemplateProps): Promise<IUpdateTextTemplateResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        titulo: data.title,
        conteudo: data.content,
        tipo: data.type,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/text-template/${data.id}`,
        method: 'patch',
        data: formattedData
    };

    try {
        const response = await axios<ModeloTexto>(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Modelo de texto atualizado com sucesso",
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

export default updateTextTemplate;