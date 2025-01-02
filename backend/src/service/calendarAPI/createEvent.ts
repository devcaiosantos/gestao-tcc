import { google } from "googleapis";
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export async function createEvent(
  credentials,
  calendarId: string,
  eventInfo: any,
): Promise<any> {
  // Criação do cliente JWT para autenticação
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
    // subject: 'tcc@liberato.pro.br', // Impersonar o dono do calendário
  });

  // Obter instância da API do Calendar
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: eventInfo.title,
    description: eventInfo.description,
    start: {
      dateTime: eventInfo.dateTime, // Data e hora de início
      timeZone: "America/Sao_Paulo", // Fuso horário
    },
    end: {
      dateTime: "2024-12-30T12:00:00-03:00", // Data e hora de término
      timeZone: "America/Sao_Paulo",
    },
    attendees: [
      //{ email: 'example@example.com' }, // Convidados
    ],
  };

  try {
    const response = await calendar.events.insert({
      calendarId, // ID do calendário
      requestBody: event, // Dados do evento
    });
    console.log("Evento criado com sucesso:", response.data.htmlLink);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
  }
}
