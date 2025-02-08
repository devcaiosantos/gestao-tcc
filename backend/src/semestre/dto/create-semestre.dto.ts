export class CreateSemestreDto {
  /**
   * Ano do semestre
   * @example 2021
   * @format int32
   */
  ano: number;

  /**
   * Número do semestre
   * @example 1
   * @minimum 1
   * @maximum 2
   * @format int32
   */
  numero: number;

  /**
   * Indica se o semestre está ativo
   * @example true
   */
  ativo: boolean;
}
