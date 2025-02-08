import { AlunoDTO } from "src/aluno/dto/aluno.dto";
import { ProfessorDTO } from "src/professor/dto/professor.dto";
import { BancaDTO } from "./banca.dto";

export class EnrollmentDto {
  /**
   * Identificador da matrícula
   * @example 1
   * @format int32
   */
  id: number;

  /**
   * RA do aluno
   * @example
   * "123456"
   * @format string
   */
  raAluno: string;

  /**
   * Etapa da matrícula
   * @example "TCC1"
   * @format string
   */
  etapa: string;

  /**
   * Status da matrícula
   * @example "aprovado"
   * @format string
   */
  status: string;

  /**
   * Identificador do semestre
   * @example 1
   * @format int32
   */
  idSemestre: number;

  /**
   * Identificador do orientador
   * @example 1
   * @format int32
   */
  idOrientador: number;

  /**
   * Identificador do coorientador
   * @example 1
   * @format int32
   */

  idCoorientador: number;

  /**
   * Data de criação da matrícula
   * @example "2021-09-01T00:00:00Z"
   */
  dataCriacao: Date;

  /**
   * Data de atualização da matrícula
   * @example "2021-09-01T00:00:00Z"
   */
  dataAtualizacao: Date;

  Aluno: AlunoDTO;

  Orientador: ProfessorDTO;

  Coorientador: ProfessorDTO;

  Banca: BancaDTO;
}
