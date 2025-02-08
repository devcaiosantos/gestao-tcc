export class DefineBoardDTO {
  /**
   * ID da matrícula
   * @example 123
   */
  idMatricula: number;

  /**
   * Título do trabalho
   * @example "string"
   */
  titulo: string;

  /**
   * ID dos membros da banca
   * @example [123, 456]
   */
  idMembros: number[];
}
