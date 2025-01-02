export interface IAdmin {
    id: number;
    name: string;
    email: string;
    systemEmail?: string;
    systemEmailKey?: string
}

export interface ITeacher {
    id: number;
    name: string;
    email: string;
    department: string;
    active: boolean;
}

export interface ITextTemplate {
    id: number;
    title: string;
    content: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISemester {
    id: number;
    year: number;
    number: number;
    active: boolean;
}

export interface IEnrollmentStudent {
    id: number;
    studentRA: string;
    studentName: string;
    studentEmail: string;
    stage: string;
    status: string;
    semesterId: number;
    supervisorId: number | null;
    supervisorName: string | null;
    coSupervisorId: number | null;
    coSupervisorName: string | null;
    members: number[];
    presidentId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStudent {
    name: string;
    email: string;
    ra: string;
}

export type EnrollmentStatus =
     "matriculado" | 
     "orientador_definido" | 
     "banca_preenchida" | 
     "banca_agendada" | 
     "aprovado" | 
     "reprovado" | 
     "nao_finalizado";
export interface IGoogleCredentials {
    type: string;
    projectId: string;
    privateKeyId: string;
    privateKey: string;
    client_email: string;
    clientId: string;
    authUri: string;
    tokenUri: string;
    authProviderX509CertUrl: string;
    clientX509CertUrl: string;
}

      