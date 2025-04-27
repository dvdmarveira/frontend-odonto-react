import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para tentar renovar o token usando o refresh token
const refreshToken = async () => {
  const refresh = localStorage.getItem("@OdontoLegal:refresh_token");

  if (!refresh) {
    throw new Error("Refresh token não encontrado!");
  }

  try {
    // Supondo que a rota /auth/refresh-token existe no servidor
    const response = await api.post("/api/users/refresh-token", {
      refresh_token: refresh,
    });
    const { token, refresh_token } = response.data.data;

    // Atualiza os tokens no localStorage
    localStorage.setItem("@OdontoLegal:token", token);
    localStorage.setItem("@OdontoLegal:refresh_token", refresh_token);

    // Atualiza o header da requisição com o novo token
    api.defaults.headers.Authorization = `Bearer ${token}`;

    return token;
  } catch (error) {
    // Se não conseguir renovar o token, remove ambos e redireciona para login
    localStorage.removeItem("@OdontoLegal:token");
    localStorage.removeItem("@OdontoLegal:refresh_token");
    window.location.href = "/login"; // Redireciona para login
    throw error; // Lança erro para que o fluxo de erro seja seguido
  }
};

// Interceptor de requisição para adicionar o token de acesso
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@OdontoLegal:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erro 401 e tentar renovar o token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // Se o erro for 401, tenta renovar o token
      try {
        const newToken = await refreshToken();

        // Atualiza o header Authorization da requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Reenvia a requisição original com o novo token
        return api(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
