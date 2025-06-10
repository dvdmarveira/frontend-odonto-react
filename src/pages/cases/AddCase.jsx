// src/pages/cases/AddCase.jsx (Versão com permissão de status)
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Spinner } from "@phosphor-icons/react";
import CaseService from "../../services/cases/caseService";
import UserService from "../../services/users/userService";
import { useAuth } from "../../contexts/useAuth"; // <-- 1. Importa o useAuth

const AddCase = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const isEditMode = Boolean(caseId);
  const { user } = useAuth(); // <-- 2. Pega os dados do usuário logado

  // ... (outros useStates: isLoading, error, users, formData) ...
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    /* ... */
  });

  // useEffect para buscar dados (código inalterado)
  useEffect(() => {
    /* ... */
  }, [caseId, isEditMode, navigate]);

  const handleChange = (e) => {
    /* ... */
  };
  const handleSubmit = async (e) => {
    /* ... */
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Editar Caso" : "Criar Novo Caso"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... (campos Title e Type) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status*
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              // --- 3. LÓGICA DE PERMISSÃO APLICADA AQUI ---
              disabled={
                !user || (user.role !== "admin" && user.role !== "perito")
              }
            >
              <option value="em_andamento">Em Andamento</option>
              <option value="finalizado">Finalizado</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Responsável
            </label>
            <select
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              // --- LÓGICA DE PERMISSÃO APLICADA AQUI TAMBÉM ---
              disabled={
                !user || (user.role !== "admin" && user.role !== "perito")
              }
            >
              <option value="">-- Nenhum --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ... (resto do formulário e botões) ... */}
      </form>
    </div>
  );
};

export default AddCase;
