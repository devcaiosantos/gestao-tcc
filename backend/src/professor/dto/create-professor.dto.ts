type Departamento =
  | "DACOM"
  | "DAAMB"
  | "DACOC"
  | "DAELN"
  | "DAAEQ"
  | "DAQUI"
  | "DABIC"
  | "DAFIS"
  | "DAGEE"
  | "DAHUM"
  | "DAMAT"
  | "OUTRO";

export class CreateProfessorDto {
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
  departamento: Departamento;

  /**
   * Se o professor está ativo
   * @example true
   */
  ativo: boolean;
}
