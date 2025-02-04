export interface EnrollStudent {
  ra: string;
  nome: string;
  email: string;
}
export interface IfindEnrollmentsProps {
  stage: Stage;
  idSemester: number;
  term: string;
  status: Status;
}

export type Status =
  | "todos"
  | "matriculado"
  | "orientador_definido"
  | "banca_preenchida"
  | "banca_agendada"
  | "aprovado"
  | "reprovado"
  | "nao_finalizado";

export type Stage = "TCC1" | "TCC2";
