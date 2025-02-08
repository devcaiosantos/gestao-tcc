export class CreateEnrollmentDto {
  /**
   * RA do aluno
   * @example 123456
   */
  ra: string;

  /**
   * Nome do aluno
   * @example Fulano de Tal
   */
  nome: string;

  /**
   * Email do aluno
   * @example fulano@tal
   */
  email: string;
}
