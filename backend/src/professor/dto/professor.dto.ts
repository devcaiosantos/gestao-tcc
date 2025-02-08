export class ProfessorDTO {
  /**
   * ID do professor
   * @example 1
   */
  id: number;

  /**
   * Nome do professor
   * @example João da Silva
   */
  nome: string;

  /**
   * E-mail do professor
   * @example example@example.com
   */
  email: string;

  /**
   * Departamento do professor
   * @example DACOM
   */
  departamento: string;

  /**
   * Se o professor está ativo
   * @example true
   */

  ativo: boolean;
}
