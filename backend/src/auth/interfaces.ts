export interface LoginProps {
  email: string;
  senha: string;
}

export interface AuthData {
  id: number;
  email: string;
  nome: string;
  emailSistema?: string;
  chaveEmailSistema?: string;
  access_token: string;
  expires_in: number;
}
