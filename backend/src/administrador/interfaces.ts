export interface createAdministradorProps {
  nome: string;
  email: string;
  senha: string;
  emailSistema: string;
  chaveEmailSistema: string;
  idCalendario: string;
}
export interface resetPasswordProps {
  senha: string;
  novaSenha: string;
}
