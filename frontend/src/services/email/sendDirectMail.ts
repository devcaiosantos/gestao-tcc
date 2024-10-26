import axios from 'axios';
import { getCookie } from '@/utils/cookies';

interface ISendDirectMailProps {
    recipients: string[];
    subject: string;
    text: string;
}

interface ISendDirectMailResponse {
    status: "success" | "error";
    message: string;
}

export type Status = "success" | "error";

const sendDirectMail = async (data: ISendDirectMailProps): Promise<ISendDirectMailResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        destinatarios: data.recipients,
        assunto: data.subject,
        texto: data.text
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("tcc-token")}`
        },
        url: URL + `/send-direct-mail`,
        method: 'post',
        data: formattedData
    };

    try {
        await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "E-mails enviados com sucesso"
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

export default sendDirectMail;