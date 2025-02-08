import { BancaDTO } from "./banca.dto";
import { ProfessorDTO } from "src/professor/dto/professor.dto";

export class BancaMembroDTO {
  /**
   * Identificador do membro da banca
   * @example 1
   * @format int32
   */
  id: number;

  /**
   * Identificador da banca
   * @example 1
   * @format int32
   */
  bancaId: number;

  /**
   * Identificador do professor
   * @example 1
   * @format int32
   */
  professorId: number;

  /**
   * Indica se o professor é presidente da banca
   * @example true
   * @format boolean
   */
  isPresidente: boolean;

  /**
   * Data de criação do membro da banca
   * @example "2021-09-01T00:00:00Z"
   * @format date-time
   */
  dataCriacao: Date;

  /**
   * Data de atualização do membro da banca
   * @example "2021-09-01T00:00:00Z"
   * @format date-time
   */
  dataAtualizacao: Date;

  /**
   * Banca
   */
  banca: BancaDTO;

  /**
   * Professor
   */
  professor: ProfessorDTO;
}
