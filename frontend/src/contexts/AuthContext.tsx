import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { IAdmin, ISemester } from "../interfaces";
import { getCookie } from "@/utils/cookies";
import parseJwt from "@/utils/parseJwt";
import getAdminInfo from "@/services/administrator/getAdminInfo";
import findActiveSemester from "@/services/semester/findActive";
interface ConnectionError {
    message?: string;
}
interface AuthContextType {
    registerAdmin: (admin: IAdmin) => void;
    clearAdmin: () => void;
    admin: IAdmin | null;
    connectionError: ConnectionError;
    activeSemester: ISemester | null;
}

// Criando o contexto
export const AuthContext = createContext<AuthContextType>({
    registerAdmin: () => {},
    clearAdmin: () => {},
    admin: null,
    connectionError: {},
    activeSemester: null
});


// Criando um componente provedor para envolver sua aplicação
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [admin, setAdmin] = useState<IAdmin | null>(null);
    const [connectionError, setConnectionError] = useState({});
    const [activeSemester, setActiveSemester] = useState<ISemester | null>(null);
    useEffect(() => {
        const token = getCookie("tcc-token");
        if(!token){
            return;
        }
        const decodedJwt = parseJwt(token);
        const fetchAdmin = async () => {
            if(decodedJwt){
                const response = await getAdminInfo(decodedJwt.id);

                if(response.status === "error"){
                    setConnectionError({ message: response.message });
                    return;
                }

                if(response.status === "success" && response.data){
                    setConnectionError({});
                    registerAdmin({
                        id: response.data.id,
                        name: response.data.nome,
                        email: response.data.email,
                        email_system: response.data.email_sistema,
                        password_email_system: response.data.senha_email_sistema
                    });
                }
            }
        }
        fetchAdmin();
    }, []);

    useEffect(() => {
        if(admin && admin.id){
            const fetchActiveSemester = async () => {
                const response = await findActiveSemester();
                if(response.status === "error"){
                    console.error(response.message);
                    return;
                }
                if(response.data){
                    setActiveSemester(response.data);
                }
            }
            fetchActiveSemester();
        }
    }, [admin]);


    function registerAdmin(admin: IAdmin) {
        setAdmin({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            email_system: admin.email_system,
            password_email_system: admin.password_email_system
        });
    }

    function clearAdmin() {
        setAdmin(null);
    }

    return (
        <AuthContext.Provider
            value={{
                registerAdmin,
                clearAdmin,
                admin,
                connectionError,
                activeSemester
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
