import React, { createContext, useState, useEffect } from "react";
import api from "../services/api"; // Agora api.js cuida da renovação do token

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carregar o usuário apenas se o token for válido e estiver presente
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("@OdontoLegal:token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        // Lógica para verificar a validade do token ou chamar um endpoint de refresh
        const response = await api.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        setError(`Erro ao carregar usuário: ${error.message || error}`);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await api.post(
        "/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);

      const { token, refreshToken, user } = response.data;

      if (!token) {
        throw new Error("Dados de login inválidos.");
      }

      console.log("Armazenando token:", token);
      console.log("Armazenando refreshToken:", refreshToken);

      localStorage.setItem("@OdontoLegal:token", token);
      localStorage.setItem("@OdontoLegal:refresh_token", refreshToken);
      setUser(user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
      throw err;
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await api.post("/api/users/register", userData, {
        withCredentials: true,
      });
      const { token, user: newUser } = response.data;

      localStorage.setItem("@OdontoLegal:token", token);
      setUser(newUser);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar conta");
      throw err;
    }
  };

  const signOut = () => {
    localStorage.removeItem("@OdontoLegal:token");
    localStorage.removeItem("@OdontoLegal:refresh_token");

    setUser(null);
    setLoading(false);
  };

  const forgotPassword = async (email) => {
    try {
      await api.post("/api/users/forgot-password", { email });
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao solicitar recuperação de senha"
      );
      throw err;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await api.patch(`/api/users/reset-password/${token}`, { password });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao redefinir senha");
      throw err;
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.patch("/api/users/update-profile", data);
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar perfil");
      throw err;
    }
  };

  const updatePassword = async (data) => {
    try {
      await api.patch("/api/users/update-password", data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar senha");
      throw err;
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    if (user.role === "admin") return true;

    const permissions = {
      perito: [
        "view_cases",
        "create_cases",
        "edit_cases",
        "create_reports",
        "edit_reports",
      ],
      assistente: ["view_cases", "view_reports"],
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePassword,
    hasPermission,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue_primary"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
