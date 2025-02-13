export class AdministradorDto {
  /*
   * ID do administrador
   * @example 1
   */
  id: number;

  /* Nome do administrador
   * @example João da Silva
   */
  nome: string;

  /* Email do administrador
   * @example example@gmail.com
   */
  email: string;

  /* Senha do administrador
   * @example 123456teste
   */
  senha: string;

  /* Email do sistema
   * @example example@gmail.com
   */
  emailSistema: string;

  /* Chave do email do sistema
   * @example 123456teste
   */
  chaveEmailSistema: string;

  /* ID do calendário
   * @example 123456teste
   */
  idCalendario: string;
}
