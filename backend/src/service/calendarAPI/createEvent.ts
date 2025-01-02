import { google } from "googleapis";
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
export async function createEvent({
  credentials,
  calendarId,
  eventInfo,
}: ICreateEvent): Promise<any> {
  // Criação do cliente JWT para autenticação
  const auth = new google.auth.JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: SCOPES,
  });

  // Obter instância da API do Calendar
  const calendar = google.calendar({ version: "v3", auth });

  //EndDate = dateTIme + 1h
  const auxEndDate = new Date(eventInfo.dateTime);
  auxEndDate.setHours(auxEndDate.getHours() + 1);
  //Format: '2024-12-30T11:00:00-03:00'
  const endDate = auxEndDate.toISOString();

  const event = {
    summary: eventInfo.title,
    description: eventInfo.description,
    start: {
      dateTime: eventInfo.dateTime, // Data e hora de início
      timeZone: "America/Sao_Paulo", // Fuso horário
    },
    end: {
      dateTime: endDate, // Data e hora de término
      timeZone: "America/Sao_Paulo",
    },
    attendees: [
      //{ email: 'example@example.com' }, // Convidados
    ],
  };

  const response = await calendar.events
    .insert({
      calendarId, // ID do calendário
      requestBody: event, // Dados do evento
    })
    .then((res) => {
      return {
        status: "success",
        message: "Evento criado com sucesso",
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err || "Erro ao agendar evento Google Calendar",
      };
    });

  return response;
}
