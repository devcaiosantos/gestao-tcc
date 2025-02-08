import { BancaMembroDTO } from "./banca-membro.dto";
export class BancaDTO {
  // id                 Int       @id @default(autoincrement())
  // titulo             String
  // dataHorario        DateTime? @default(now())
  // local              String?
  // idEventoAgenda     String?
  // nota               Float?
  // dataCriacao        DateTime  @default(now())
  // dataAtualizacao    DateTime  @updatedAt
  // idAlunoMatriculado Int       @unique

  // aluno   AlunoMatriculado @relation("AlunoBanca", fields: [idAlunoMatriculado], references: [id], onDelete: Cascade)
  // membros BancaMembro[]    @relation("BancaMembros")
  /**
   * Identificador da banca
   * @example 1
   * @format int32
   */
  id: number;

  /**
   * Título da banca
   * @example "Banca de TCC"
   * @format string
   */
  titulo: string;

  /**
   * Data e horário da banca
   * @example "2021-09-01T00:00:00Z"
   * @format date-time
   */
  dataHorario: Date;

  /**
   * Local da banca
   * @example "Sala 1"
   * @format string
   */
  local: string;

  /**
   * Identificador do evento da agenda
   * @example "1"
   * @format string
   */
  idEventoAgenda: string;

  /**
   * Nota da banca
   * @example 10
   * @format float
   */
  nota: number;

  /**
   * Data de criação da banca
   * @example "2021-09-01T00:00:00Z"
   * @format date-time
   */
  dataCriacao: Date;

  /**
   * Data de atualização da banca
   * @example "2021-09-01T00:00:00Z"
   * @format date-time
   */
  dataAtualizacao: Date;

  /**
   * Identificador do aluno matriculado
   * @example 1
   * @format int32
   */
  idAlunoMatriculado: number;

  membros: BancaMembroDTO[];
}
