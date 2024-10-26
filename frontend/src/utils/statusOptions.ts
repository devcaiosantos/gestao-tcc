import { EnrollmentStatus } from "@/interfaces";

export interface IStatusOptions {
    value: EnrollmentStatus | "todos";
    label: string;
    colorScheme: string;
}

export const statusOptions: IStatusOptions[] = [
    { value: "todos", label: "Todos", colorScheme: "#81e6d9" },
    { value: "matriculado", label: "Matriculado", colorScheme: "#d6bcfa" },
    { value: "orientador_definido", label: "Orientador Definido", colorScheme: "#fbb6ce" },
    { value: "banca_preenchida", label: "Banca Preenchida", colorScheme: "#fbd38d" },
    { value: "banca_agendada", label: "Banca Agendada", colorScheme: "#90cdf4" },
    { value: "aprovado", label: "Aprovado", colorScheme: "#9ae6b4" },
    { value: "reprovado", label: "Reprovado", colorScheme: "#feb2b2" },
    { value: "nao_finalizado", label: "Não Finalizado", colorScheme: "#faf089" }
];
