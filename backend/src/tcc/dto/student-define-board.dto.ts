export class StudentDefineBoardDTO {
  /**
   * Token Aluno
   * @example eadsdewasdasd
   */
  token: string;

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
