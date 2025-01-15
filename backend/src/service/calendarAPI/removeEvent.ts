import { google } from "googleapis";
import { IGoogleCredentials } from "src/google-credentials/interfaces";
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

interface IRemoveEvent {
  credentials: IGoogleCredentials;
  calendarId: string;
  eventId: string;
}
export async function removeEvent({
  credentials,
  calendarId,
  eventId,
}: IRemoveEvent): Promise<any> {
  // Criação do cliente JWT para autenticação
  const auth = new google.auth.JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: SCOPES,
  });

  // Obter instância da API do Calendar
  const calendar = google.calendar({ version: "v3", auth });

  const response = await calendar.events
    .delete({
      calendarId, // ID do calendário
      eventId: eventId, // ID do evento
    })
    .then((res) => {
      return {
        status: "success",
        message: "Evento desmarcado com sucesso",
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: "error",
        message: err || "Erro ao desmarcar evento Google Calendar",
      };
    });

  return response;
}
