import axios from 'axios';

interface IDefineBoardStudentProps {
    title: string;
    token: string;
    memberIds: number[];
}

interface IDefineBoardStudentResponse {
    status: "success" | "error";
    message: string;
}

type Status = "success" | "error";

const defineBoardStudent = async (data: IDefineBoardStudentProps): Promise<IDefineBoardStudentResponse> => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    if (!URL) {
        throw new Error('Variável de ambiente não configurada');
    }

    const formattedData = {
        titulo: data.title,
        idMembros: data.memberIds,
        token: data.token
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        url: URL + `/tcc/definir-banca/aluno`,
        method: 'put',
        data: formattedData
    };

    try {
        await axios(config);

        const status: Status = "success";
        return {
            status: status,
            message: "Banca definida com sucesso",
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

export default defineBoardStudent;