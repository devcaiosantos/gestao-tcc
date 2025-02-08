// { idMatricula, dataHorario, local }

export class ScheduleBoardDTO {
  /**
   * ID da matrícula
   * @example 123
   */
  idMatricula: number;

  /**
   * Data e horário da apresentação
   * @example "2021-08-23T00:00:00.000Z"
   */
  dataHorario: string;

  /**
   * Local da apresentação
   * @example "string"
   */
  local: string;
}
