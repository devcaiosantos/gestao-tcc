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
}