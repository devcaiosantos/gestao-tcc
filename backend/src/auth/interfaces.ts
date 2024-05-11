export interface LoginProps {
  email: string;
  senha: string;
}

export interface AuthData {
  access_token: string;
  expires_in: number;
}
