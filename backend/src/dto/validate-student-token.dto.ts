export class ValidateStudentTokenDTO {
  /**
   * Token de acesso
   * @example ea7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b
   */
  token: string;

  /**
   * Status do token
   * @example matriculado
   */
  status: string;
}
