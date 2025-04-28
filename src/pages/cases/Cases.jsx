import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Plus,
  Eye,
  PencilSimple,
  Calendar,
  User,
  ClockCounterClockwise,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import CaseService from "../../services/cases/caseService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";

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
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, [filters, pagination.currentPage]);

  const loadCases = async () => {
    try {
      setIsLoading(true);
      const response = await CaseService.getCases(
        filters,
        pagination.currentPage
      );

      if (response.success) {
        setCases(response.data.cases || []);
        setStats(response.data.stats || DEFAULT_STATS);
        setPagination(response.data.pagination || DEFAULT_PAGINATION);
      } else {
        toast.error(response.error || "Erro ao buscar casos");
        // Em caso de erro, mantenha os valores padrão
        setStats(DEFAULT_STATS);
        setPagination(DEFAULT_PAGINATION);
      }
    } catch (error) {
      console.error("Erro ao buscar casos:", error);
      toast.error("Erro ao carregar os casos");
      // Em caso de erro, mantenha os valores padrão
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

  const handleViewCase = (caseId) => {
    navigate(`/cases/${caseId}`);
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
        return "bg-gray-100 text-gray-800";
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
      <div className="bg-blue_dark shadow-xl rounded-lg p-4 mb-10 flex justify-between">
        <div className="text-center flex-1 border-r border-blue_primary">
          <h3 className="text-white font-medium">Casos em andamento</h3>
          <p className="text-white text-3xl font-bold">
            {stats?.emAndamento || 0}
          </p>
        </div>
        <div className="text-center flex-1 border-r border-blue_primary">
          <h3 className="text-white font-medium">Casos Arquivados</h3>
          <p className="text-white text-3xl font-bold">
            {stats?.arquivados || 0}
          </p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-white font-medium">Casos Concluídos</h3>
          <p className="text-white text-3xl font-bold">
            {stats?.finalizados || 0}
          </p>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar casos..."
          />

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_secondary"
          >
            <option value="todos">Todos os Status</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="finalizado">Finalizado</option>
            <option value="arquivado">Arquivado</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_secondary"
          >
            <option value="">Todos os Tipos</option>
            <option value="acidente">Acidente</option>
            <option value="identificacao">Identificação</option>
            <option value="criminal">Criminal</option>
          </select>
        </div>

        <button
          onClick={handleAddCase}
          className="bg-blue_primary hover:bg-blue_secondary text-white px-4 py-2 rounded-lg inline-flex items-center"
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
                <tr className="border-b border-blue_primary border-opacity-20">
                  <th className="py-4 px-4 text-left text-white">
                    Responsável
                  </th>
                  <th className="py-4 px-4 text-left text-white">Caso</th>
                  <th className="py-4 px-4 text-center text-white">Status</th>
                  <th className="py-4 px-4 text-center text-white">Data</th>
                  <th className="py-4 px-4 text-right text-white">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(
                  (caso) =>
                    caso && (
                      <tr
                        key={caso.id}
                        className="border-b border-blue_primary border-opacity-20 hover:bg-blue_dark transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-white">
                          <div className="flex items-center">
                            <User size={20} className="mr-2" />
                            {caso.responsible?.name || "Não atribuído"}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white">
                          <div>
                            <span className="font-bold">
                              #{caso.id?.slice(-4) || "N/A"}
                            </span>
                            <p className="text-sm">
                              {caso.title || "Sem título"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${statusColor(
                              caso.status
                            )} text-white`}
                          >
                            {caso.status === "em_andamento"
                              ? "Em Andamento"
                              : caso.status === "finalizado"
                              ? "Finalizado"
                              : "Arquivado"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-white">
                          <div className="flex items-center justify-center">
                            <Calendar size={20} className="mr-2" />
                            {formatarData(caso.createdAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleViewCase(caso.id)}
                            className="bg-red_secondary hover:bg-opacity-90 text-white px-4 py-2 rounded-full inline-flex items-center mr-2"
                          >
                            <Eye size={16} className="mr-1" />
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Mostrando {filteredCases.length} de {pagination?.total || 0} casos
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50"
              >
                <CaretLeft size={20} />
              </button>
              <span className="px-4 py-2">
                Página {pagination?.currentPage || 1} de{" "}
                {pagination?.pages || 1}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.pages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50"
              >
                <CaretRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cases;
