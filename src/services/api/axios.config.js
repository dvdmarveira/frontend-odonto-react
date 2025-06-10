// src/services/api/axios.config.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Mantém a funcionalidade existente de token
    const token = localStorage.getItem("@OdontoLegal:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adiciona logs para debug em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          headers: config.headers,
          data: config.data,
          params: config.params,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]:", error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    // Adiciona logs para debug em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }
    return response;
  },
  (error) => {
    // Log detalhado do erro
    console.error("[API Response Error]:", {
      status: error.response?.status,
      message: error.response?.data?.msg || error.message,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Mantém o redirecionamento existente para 401
    if (error.response?.status === 401) {
      // Limpa dados da sessão antes de redirecionar
      localStorage.removeItem("@OdontoLegal:token");
      localStorage.removeItem("@OdontoLegal:refresh_token");
      window.location.href = "/login";
    }

    // Tratamento específico para erros comuns
    switch (error.response?.status) {
      case 403:
        console.warn("Acesso não autorizado");
        break;
      case 404:
        console.warn("Recurso não encontrado");
        break;
      case 500:
        console.error("Erro interno do servidor");
        break;
    }

    return Promise.reject(error);
  }
);

// Adiciona método para refresh token (preparação para futura implementação)
api.refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("@OdontoLegal:refresh_token");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { token } = response.data;
    localStorage.setItem("@OdontoLegal:token", token);

    return token;
  } catch (error) {
    localStorage.removeItem("@OdontoLegal:token");
    localStorage.removeItem("@OdontoLegal:refresh_token");
    window.location.href = "/login";
    return null;
  }
};

export default api;
