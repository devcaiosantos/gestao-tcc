export class AuthDataDTO {
  id: number;
  email: string;
  nome: string;
  emailSistema?: string;
  chaveEmailSistema?: string;
  access_token: string;
  expires_in: number;
}
