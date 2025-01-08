import { google, calendar_v3 } from "googleapis";
import { IGoogleCredentials } from "src/google-credentials/interfaces";
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

interface IEventInfo {
  title: string;
  description: string;
  dateTime: string;
  location: string;
}

interface ICreateEvent {
  credentials: IGoogleCredentials;
  calendarId: string;
  eventInfo: IEventInfo;
}

interface ICreateEventSuccessResponse {
  status: "success";
  message: string;
  data: calendar_v3.Schema$Event; // Tipo específico da API do Google Calendar
}

interface ICreateEventErrorResponse {
  status: "error";
  message: string;
}

type ICreateEventResponse =
  | ICreateEventSuccessResponse
  | ICreateEventErrorResponse;

export async function createEvent({
  credentials,
  calendarId,
  eventInfo,
}: ICreateEvent): Promise<ICreateEventResponse> {
  // Criação do cliente JWT para autenticação
  const auth = new google.auth.JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: SCOPES,
  });

  // Obter instância da API do Calendar
  const calendar = google.calendar({ version: "v3", auth });

  // Calcula a data de término (início + 1 hora)
  const auxEndDate = new Date(eventInfo.dateTime);
  auxEndDate.setHours(auxEndDate.getHours() + 1);
  const endDate = auxEndDate.toISOString();

  const event: calendar_v3.Schema$Event = {
    summary: eventInfo.title,
    description: eventInfo.description,
    start: {
      dateTime: eventInfo.dateTime,
      timeZone: "America/Sao_Paulo",
    },
    end: {
      dateTime: endDate,
      timeZone: "America/Sao_Paulo",
    },
    attendees: [
      // Adicionar convidados, se necessário
    ],
  };

  const response: ICreateEventResponse = await calendar.events
    .insert({
      calendarId,
      requestBody: event,
    })
    .then((res) => {
      return {
        status: "success",
        message: "Evento criado com sucesso",
        data: res.data,
      } as ICreateEventSuccessResponse;
    })
    .catch((err) => {
      return {
        status: "error",
        message: err.message || "Erro ao agendar evento Google Calendar",
      } as ICreateEventErrorResponse;
    });

  return response;
}
