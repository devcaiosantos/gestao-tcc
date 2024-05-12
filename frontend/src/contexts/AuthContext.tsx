import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { IAdmin } from "../interfaces";
import { getCookie } from "@/utils/cookies";
import parseJwt from "@/utils/parseJwt";

interface AuthContextType {
    registerAdmin: (admin: IAdmin) => void;
    clearAdmin: () => void;
    admin: IAdmin | null;
}

// Criando o contexto
export const AuthContext = createContext<AuthContextType>({
    registerAdmin: () => {},
    clearAdmin: () => {},
    admin: null,
});


// Criando um componente provedor para envolver sua aplicação
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [admin, setAdmin] = useState<IAdmin | null>(null);

    useEffect(() => {
        const token = getCookie("tcc-token");
        if(!token){
            return;
        }

        const decodedJwt = parseJwt(token);
        if(decodedJwt){
            registerAdmin({
                id: decodedJwt.id,
                name: decodedJwt.nome,
                email: decodedJwt.email,
                email_system: decodedJwt.email_sistema,
                password_email_system: decodedJwt.senha_email_sistema
            });
        }

    }, []);

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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
