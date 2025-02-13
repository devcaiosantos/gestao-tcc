export class AlunoDTO {
  /**
   * Identificador do aluno
   * @example 1
   * @format int32
   */
  id: number;

  /**
   * RA do aluno
   * @example "123456"
   * @format string
   */
  ra: string;

  /**
   * Nome do aluno
   * @example "Fulano de Tal"
   * @format string
   */
  nome: string;

  /**
   * Email do aluno
   * @example "fulano@tal"
   * @format string
   */
  email: string;

  /**
   * Data de criação do aluno
   * @example "2021-09-01T00:00:00Z"
   */
  dataCriacao: Date;

  /**
   * Data de atualização do aluno
   * @example "2021-09-01T00:00:00Z"
   */
  dataAtualizacao: Date;
}
