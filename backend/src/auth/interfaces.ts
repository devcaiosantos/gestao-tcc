export interface LoginProps {
  email: string;
  senha: string;
}

export interface AuthData {
  id: number;
  email: string;
  nome: string;
  email_sistema?: string;
  senha_email_sistema?: string;
  access_token: string;
  expires_in: number;
}
