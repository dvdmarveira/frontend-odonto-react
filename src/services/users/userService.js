// src/services/users/userService.js
import api from "../api/axios.config";

class UserService {
  /**
   * Busca todos os usuários do sistema.
   * Ideal para preencher listas de seleção (dropdowns).
   */
  async getUsers() {
    try {
      // A rota do backend para buscar usuários é /api/users
      const response = await api.get("/users");
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar usuários",
      };
    }
  }
}

export default new UserService();
