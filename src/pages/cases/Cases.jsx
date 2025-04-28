import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Plus,
  Eye,
  Calendar,
  User,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import CaseService from "../../services/cases/caseService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import CaseDetailModal from "../../components/modals/CaseDetailModal";

const DEFAULT_STATS = {
  emAndamento: 0,
  arquivados: 0,
  finalizados: 0,
};

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  total: 0,
  pages: 1,
};

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "todos",
    type: "",
  });
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, [filters, pagination.currentPage]);

  // Função para calcular as estatísticas
  const calculateStats = (casesData) => {
    return casesData.reduce(
      (acc, caso) => {
        switch (caso.status) {
          case "em_andamento":
            acc.emAndamento++;
            break;
          case "finalizado":
            acc.finalizados++;
            break;
          case "arquivado":
            acc.arquivados++;
            break;
        }
        return acc;
      },
      { emAndamento: 0, finalizados: 0, arquivados: 0 }
    );
  };

  const loadCases = async () => {
    try {
      setIsLoading(true);
      const response = await CaseService.getCases(
        filters,
        pagination.currentPage
      );

      if (response.success) {
        const casesData = response.data.cases || [];
        setCases(casesData);

        // Calcular estatísticas com base nos casos retornados
        const calculatedStats = calculateStats(casesData);
        setStats(calculatedStats);

        setPagination(response.data.pagination || DEFAULT_PAGINATION);
      } else {
        toast.error(response.error || "Erro ao buscar casos");
        setStats(DEFAULT_STATS);
        setPagination(DEFAULT_PAGINATION);
      }
    } catch (error) {
      console.error("Erro ao buscar casos:", error);
      toast.error("Erro ao carregar os casos");
      setStats(DEFAULT_STATS);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const handleAddCase = () => {
    navigate("/cases/add");
  };

  const handleViewCase = async (caseId) => {
    try {
      setIsLoading(true);

      // Validar o ID antes de fazer a requisição
      if (!caseId) {
        toast.error("ID do caso não fornecido");
        return;
      }

      // Garantir que estamos usando o ID correto (pode ser _id ou id)
      const validId = caseId.toString().match(/^[0-9a-fA-F]{22,24}$/);
      if (!validId) {
        console.error("ID inválido:", caseId);
        toast.error("ID do caso em formato inválido");
        return;
      }

      console.log("Iniciando visualização do caso:", caseId);

      const response = await CaseService.getCaseById(caseId);
      console.log("Resposta do serviço:", response);

      if (response.success) {
        setSelectedCase(response.data);
        setIsModalOpen(true);
      } else {
        console.error("Erro na resposta:", response);

        // Log detalhado dos erros
        if (response.details) {
          console.error("Detalhes do erro:", {
            message: response.error,
            details: response.details,
            validation: response.validation,
          });
        }

        // Mensagem de erro mais amigável
        const errorMessage =
          response.error || "Erro ao carregar detalhes do caso";
        toast.error(errorMessage);

        // Se houver erros de validação, mostrar cada um deles
        if (response.validation) {
          Object.values(response.validation).forEach((error) => {
            toast.error(error);
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do caso:", error);
      toast.error("Erro ao carregar detalhes do caso");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredCases = cases.filter((caso) => {
    if (!caso) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      caso.title?.toLowerCase().includes(searchLower) ||
      caso.description?.toLowerCase().includes(searchLower) ||
      caso.responsible?.name?.toLowerCase().includes(searchLower)
    );
  });

  const statusColor = (status) => {
    switch (status) {
      case "em_andamento":
        return "bg-yellow-100 text-yellow-800";
      case "finalizado":
        return "bg-green-100 text-green-800";
      case "arquivado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatarData = (data) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="bg-blue_dark shadow-xl rounded-lg p-6 mb-10 flex justify-between">
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">
            Casos em andamento
          </h3>
          <p className="text-white text-4xl font-bold">
            {stats?.emAndamento || 0}
          </p>
        </div>
        <div className="text-center flex-1 mx-4">
          <h3 className="text-white text-lg font-medium mb-2">
            Casos Arquivados
          </h3>
          <p className="text-white text-4xl font-bold">
            {stats?.arquivados || 0}
          </p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">
            Casos Finalizados
          </h3>
          <p className="text-white text-4xl font-bold">
            {stats?.finalizados || 0}
          </p>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar casos..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_dark"
            />
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_dark bg-white"
        >
          <option value="todos">Todos os Status</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="finalizado">Finalizado</option>
          <option value="arquivado">Arquivado</option>
        </select>

        <button
          onClick={handleAddCase}
          className="bg-blue_dark hover:bg-blue_primary text-white px-6 py-2 rounded-lg inline-flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Novo Caso
        </button>
      </div>

      {/* Cases Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue_primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando casos...</p>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum caso encontrado</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="w-full bg-blue_quaternary rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-white">
                  <th className="py-4 px-6 text-left text-white font-medium">
                    Responsável
                  </th>
                  <th className="py-4 px-6 text-left text-white font-medium">
                    Caso
                  </th>
                  <th className="py-4 px-6 text-center text-white font-medium">
                    Status
                  </th>
                  <th className="py-4 px-6 text-center text-white font-medium">
                    Data
                  </th>
                  <th className="py-4 px-6 text-right text-white font-medium">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caso) => (
                  <tr
                    key={caso.id}
                    className="border-b border-white hover:bg-blue_dark transition-colors"
                  >
                    <td className="py-4 px-6 text-white">
                      <div className="flex items-center">
                        <User size={20} className="mr-2 text-white-400" />
                        {caso.responsible?.name || "Não atribuído"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{caso.title}</p>
                        <p className="text-sm text-gray-400">
                          {caso.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${statusColor(
                          caso.status
                        )}`}
                      >
                        {caso.status === "em_andamento"
                          ? "Em Andamento"
                          : caso.status === "finalizado"
                          ? "Finalizado"
                          : "Arquivado"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-white">
                      <div className="flex items-center justify-center">
                        <Calendar size={20} className="mr-2 text-white-400" />
                        {formatarData(caso.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleViewCase(caso.id)}
                        className="bg-[#DC3545] hover:bg-opacity-80 text-white px-4 py-2 rounded-full inline-flex items-center"
                      >
                        <Eye size={16} className="mr-2" />
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Mostrando {filteredCases.length} de {pagination?.total || 0} casos
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
              >
                <CaretLeft size={20} />
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {pagination?.currentPage || 1} de{" "}
                {pagination?.pages || 1}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.pages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
              >
                <CaretRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Case Detail Modal */}
      <CaseDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCase(null);
        }}
        caseData={selectedCase}
      />
    </div>
  );
};

export default Cases;
