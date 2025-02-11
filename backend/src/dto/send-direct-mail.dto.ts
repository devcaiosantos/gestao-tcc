export class SendDirectMailDto {
  /**
   * Destinatários do e-mail
   * @example ["example@example.com", "example2@example.com"]
   */
  destinatarios: Array<string>;
  /**
   * Assunto do e-mail
   * @example "Assunto do e-mail"
   */
  assunto: string;

  /**
   * Texto do e-mail
   * @example "Texto do e-mail"
   */

  texto: string;
}
