export class HistoricoDTO {
  /**
   * Identificador do histórico
   * @example 1
   * @format int32
   */
  id: number;
  /**
   * RA do aluno
   * @example "123456"
   * @format string
   */
  raAluno: string;

  /**
   * Identificador do semestre
   * @example 1
   * @format int32
   */
  idSemestre: number;

  /**
   * Status do histórico
   * @example "aprovado"
   * @format string
   */
  status: string;

  /**
   * Etapa do histórico
   * @example "1"
   * @format string
   */
  etapa: string;

  /**
   * Observação do histórico
   * @example "Observação"
   * @format string
   */
  observacao: string | null;

  /**
   * Data de criação do histórico
   * @example "2021-09-01T00:00:00Z"
   * @format date-time
   */
  dataCriacao: Date;
}
