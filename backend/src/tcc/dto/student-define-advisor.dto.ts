export class StudentDefineAdvisorDTO {
  /**
   * ID do orientador
   * @example 123
   */
  idOrientador: number;

  /**
   * ID do coorientador
   * @example 123
   */
  idCoorientador?: number;

  /**
   * Token do aluno
   * @example "string"
   */
  token: string;
}
