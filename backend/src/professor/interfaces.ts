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

export interface createProfessorProps {
  nome: string;
  email: string;
  departamento: Departamento;
}
