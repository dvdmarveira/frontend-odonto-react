import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Spinner, FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import CaseService from "../../services/cases/caseService";
import UserService from "../../services/users/userService";
import { useAuth } from "../../contexts/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AddCase = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const isEditMode = Boolean(caseId);
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  // Estado unificado para os dados do caso
  const [caseData, setCaseData] = useState({
    title: "",
    description: "",
    type: "identificacao",
    status: "em_andamento",
    responsible: "",
    data_do_caso: "",
    responsibleName: "",
    createdByName: "",
    createdAt: "",
  });

  // Carrega dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carrega usuários apenas se não for modo de edição de status
        // ou se o usuário for admin/perito (para o formulário de criação)
        if (!isEditMode) {
          const usersResponse = await UserService.getUsers();
          if (usersResponse.success) {
            setUsers(
              usersResponse.data.filter(
                (u) => u.role === "admin" || u.role === "perito"
              )
            );
          }
        }

        if (isEditMode) {
          const caseResponse = await CaseService.getCaseById(caseId);
          if (caseResponse.success) {
            const data = caseResponse.data;
            setCaseData({
              title: data.title || "N/A",
              description: data.description || "N/A",
              type: data.type || "N/A",
              status: data.status || "em_andamento",
              responsibleName: data.responsible?.name || "Não atribuído",
              createdByName: data.createdBy?.name || "N/A",
              createdAt: data.createdAt,
              // Mantemos os campos do form de criação vazios se não forem necessários
              responsible: "",
              data_do_caso: "",
            });
          } else {
            toast.error("Falha ao carregar os dados do caso.");
            navigate("/cases");
          }
        }
      } catch (err) {
        toast.error("Ocorreu um erro ao carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [caseId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    let result;
    if (isEditMode) {
      // Em modo de edição, atualizamos apenas o status
      result = await CaseService.updateCaseStatus(caseId, caseData.status);
    } else {
      // Em modo de criação, enviamos todos os dados do formulário
      const { responsibleName, createdByName, createdAt, ...createData } =
        caseData;
      result = await CaseService.createCase({
        ...createData,
        createdBy: user._id,
      });
    }

    if (result.success) {
      toast.success(
        `Caso ${isEditMode ? "atualizado" : "criado"} com sucesso!`
      );
      navigate(isEditMode ? `/cases/${caseId}` : "/cases");
    } else {
      setError(result.error);
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const formatarData = (data) => {
    if (!data) return "N/A";
    try {
      return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Spinner size={32} className="animate-spin text-blue_dark" />
      </div>
    );
  }

  // --- Renderização Condicional ---
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(isEditMode ? `/cases/${caseId}` : "/cases")}
          className="text-sm text-blue_dark hover:underline flex items-center mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar
        </button>

        {isEditMode ? (
          // MODO DE EDIÇÃO: Apenas status é editável
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {caseData.title}
            </h1>
            <p className="text-gray-500 mb-6">
              Alteração de status para o caso #{caseId}
            </p>

            <div className="bg-white p-8 rounded-xl shadow-lg space-y-4 mb-6">
              <div>
                <strong className="text-gray-600">Descrição:</strong>
                <p>{caseData.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong className="text-gray-600">Tipo:</strong>{" "}
                  {caseData.type}
                </p>
                <p>
                  <strong className="text-gray-600">Responsável:</strong>{" "}
                  {caseData.responsibleName}
                </p>
                <p>
                  <strong className="text-gray-600">Criado por:</strong>{" "}
                  {caseData.createdByName}
                </p>
                <p>
                  <strong className="text-gray-600">Data de Criação:</strong>{" "}
                  {formatarData(caseData.createdAt)}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <label
                htmlFor="status"
                className="block text-lg font-medium text-gray-800"
              >
                Alterar Status do Caso*
              </label>
              <select
                name="status"
                id="status"
                value={caseData.status}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md"
                disabled={user.role === "assistente"}
              >
                <option value="em_andamento">Em Andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="arquivado">Arquivado</option>
              </select>

              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue_dark text-white font-bold py-2 px-6 rounded-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Spinner size={20} className="animate-spin" />
                  ) : (
                    <FloppyDisk size={20} />
                  )}
                  Salvar Status
                </button>
              </div>
            </form>
          </div>
        ) : (
          // MODO DE CRIAÇÃO: Formulário completo
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Adicionar Novo Caso
            </h1>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-xl shadow-lg space-y-6"
            >
              {/* Campos do formulário de criação */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título do Caso*
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={caseData.title}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descrição*
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={caseData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full mt-1 p-2 border rounded-md"
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo do Caso*
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={caseData.type}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="identificacao">Identificação</option>
                    <option value="acidente">Acidente</option>
                    <option value="criminal">Criminal</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="responsible"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Responsável
                  </label>
                  <select
                    name="responsible"
                    id="responsible"
                    value={caseData.responsible}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md"
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
              <div>
                <label
                  htmlFor="data_do_caso"
                  className="block text-sm font-medium text-gray-700"
                >
                  Data do Caso (Opcional)
                </label>
                <input
                  type="date"
                  name="data_do_caso"
                  id="data_do_caso"
                  value={caseData.data_do_caso}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue_dark text-white font-bold py-2 px-6 rounded-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Spinner size={20} className="animate-spin" />
                  ) : (
                    <FloppyDisk size={20} />
                  )}
                  Criar Caso
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCase;
