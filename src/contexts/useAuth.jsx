import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook para consumir o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};
