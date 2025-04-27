import { useNavigate } from "react-router-dom"; // Importando o hook de navegação
import api from "./api"; // Supondo que api.js seja onde você tenha configurado as chamadas API

// Função de login
export const login = async (email, password) => {
  const navigate = useNavigate();
  try {
    const response = await api.post("/api/users/login", { email, password });
    const { token, refreshToken, user } = response.data.data;
    localStorage.setItem("@OdontoLegal:token", token);
    localStorage.setItem("@OdontoLegal:refresh_token", refreshToken);
    navigate("/dashboard");
    return user; // Aqui você pode retornar o usuário, caso precise disso em algum lugar
  } catch (error) {
    throw new Error("Erro ao fazer login", error);
  }
};

// Função de registro
export const register = async (name, email, password, role) => {
  try {
    const userData = { name, email, password, role };
    const response = await api.post("/api/users/register", userData);
    const { token, user } = response.data.data;
    localStorage.setItem("@OdontoLegal:token", token);
    return user; // Aqui você pode retornar o usuário, caso precise disso em algum lugar
  } catch (error) {
    throw new Error("Erro ao fazer registro", error);
  }
};
