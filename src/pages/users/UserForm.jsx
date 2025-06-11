import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Spinner, FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import userService from "../../services/users/userService";

const UserForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acessar os dados passados

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "assistente",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    // ATUALIZAÇÃO: Verifica se os dados do usuário vieram da navegação
    const userFromState = location.state?.user;

    if (isEditMode && userFromState) {
      // Se vieram, usa esses dados e não faz chamada à API
      const { name, email, role, isActive } = userFromState;
      setFormData({ name, email, role, isActive, password: "" });
      setOriginalEmail(email);
      setIsLoading(false);
    } else if (isEditMode) {
      // Fallback: se a página for recarregada, tenta a API (e falha)
      toast.error(
        "Dados do usuário não encontrados. Por favor, volte para a lista."
      );
      navigate("/admin/users");
    } else {
      // Modo de criação
      setIsLoading(false);
    }
  }, [id, isEditMode, navigate, location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    let response;
    if (isEditMode) {
      const { password, ...updateData } = formData;
      if (updateData.email === originalEmail) {
        delete updateData.email;
      }
      response = await userService.updateUser(id, updateData);
    } else {
      response = await userService.createUser(formData);
    }

    setIsLoading(false);
    if (response.success) {
      toast.success(
        `Usuário ${isEditMode ? "atualizado" : "criado"} com sucesso!`
      );
      navigate("/admin/users");
    } else {
      setError(response.error);
      toast.error(response.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Spinner size={32} className="animate-spin text-blue_dark" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/admin/users")}
          className="text-sm text-blue_dark hover:underline flex items-center mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para a lista
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Editar Usuário" : "Criar Novo Usuário"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome Completo*
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email*
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          {!isEditMode && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha*
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
                required={!isEditMode}
                placeholder="Mínimo de 6 caracteres"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 items-end">
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Função*
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="assistente">Assistente</option>
                <option value="perito">Perito</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {isEditMode && (
              <div>
                <label
                  htmlFor="isActive"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      className="sr-only"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${
                        formData.isActive ? "bg-blue-600" : "bg-gray-400"
                      }`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                        formData.isActive ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-gray-700 font-medium">
                    {formData.isActive ? "Ativo" : "Inativo"}
                  </div>
                </label>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue_dark text-white font-bold py-2 px-6 rounded-md flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50"
            >
              {isLoading ? (
                <Spinner size={20} className="animate-spin" />
              ) : (
                <FloppyDisk size={20} />
              )}
              {isEditMode ? "Salvar Alterações" : "Criar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
