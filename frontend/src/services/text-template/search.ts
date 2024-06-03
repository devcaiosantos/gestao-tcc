
import axios from 'axios';
import { getCookie } from '@/utils/cookies';
import { ITextTemplate } from "@/interfaces";


interface ISearchTextTemplatesByTermResponse {
    status: "success" | "error";
    message: string;
    data?: ITextTemplate[];
}

interface ModeloTexto {
    id: number;
    titulo: string;
    conteudo: string;
    tipo: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

type Status = "success" | "error";

const searchTextTemplates = async (term: string): Promise<ISearchTextTemplatesByTermResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/modelo-texto/search?term=${term}`,
        method: 'get'
    };

    try {
        const response = await axios<ModeloTexto[]>(config);

        const formattedData = response.data.map((template) => {
            return {
                id: template.id,
                title: template.titulo,
                content: template.conteudo,
                type: template.tipo,
                createdAt: template.dataCriacao,
                updatedAt: template.dataAtualizacao
            };
        })

        const status: Status = "success";
        return {
            status: status,
            message: "Modelos de texto encontrados com sucesso",
            data: formattedData
        };
    } catch (error) {
        let message = 'Uma falha inesperada ocorreu';

        if (error instanceof Error) {
            message = error.message;
        }

        if (axios.isAxiosError(error)) {
            message = error.response?.data.message || 'O servidor pode estar fora do ar, tente novamente mais tarde';
        }

        const status: Status = "error";
        return {
            status: status,
            message: message
        };
    }
};

export default searchTextTemplates;