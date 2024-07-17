export interface IAdmin {
    id: number;
    name: string;
    email: string;
    email_system?: string;
    password_email_system?: string
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
    createdAt: Date;
    updatedAt: Date;
}
