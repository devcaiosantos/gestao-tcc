import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
// Criando um hook para usar o contexto

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
    }
    return context;
  };

export default useAuthContext;
