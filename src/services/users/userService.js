import api from "../api/axios.config";

class UserService {
  /**
   * Busca todos os usuários do sistema.
   */
  async getUsers() {
    try {
      const response = await api.get("/users");
      // A API retorna o array de usuários diretamente no corpo da resposta (response.data)
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar usuários",
      };
    }
  }

  /**
   * Busca um usuário específico pelo seu ID.
   * @param {string} userId - O ID do usuário.
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      // CORREÇÃO: A API provavelmente retorna o objeto do usuário diretamente.
      // Ajustado para retornar response.data, em vez de response.data.data.
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao buscar detalhes do usuário",
      };
    }
  }

  /**
   * Atualiza os dados de um usuário (ex: role, isActive).
   * @param {string} userId - O ID do usuário a ser atualizado.
   * @param {object} userData - Os dados a serem atualizados.
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar usuário",
      };
    }
  }

  /**
   * Cria um novo usuário no sistema.
   * @param {object} userData - Dados do novo usuário: { name, email, password, role }.
   */
  async createUser(userData) {
    try {
      const response = await api.post("/users/register", userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar usuário",
      };
    }
  }

  /**
   * Deleta um usuário do sistema.
   * @param {string} userId - O ID do usuário a ser deletado.
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar usuário",
      };
    }
  }
}

export default new UserService();
