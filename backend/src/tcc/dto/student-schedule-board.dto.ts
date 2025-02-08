// { idMatricula, dataHorario, local }

export class StudentScheduleBoardDTO {
  /**
   * Token
   * @example asdasdsd
   */
  token: string;

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
