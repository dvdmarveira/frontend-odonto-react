import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Plus,
  Eye,
  PencilSimple,
  Calendar,
  User,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { getCases } from "../../services/cases";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "todos",
    date: "",
    responsible: "",
  });
  const [stats, setStats] = useState({
    emAndamento: 0,
    arquivados: 0,
    finalizados: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, [filters]);

  const loadCases = async () => {
    try {
      setIsLoading(true);
      const response = await getCases(filters);
      setCases(response.cases);
      setStats({
        emAndamento: response.stats.emAndamento,
        arquivados: response.stats.arquivados,
        finalizados: response.stats.finalizados,
      });
    } catch (error) {
      console.error("Erro ao carregar casos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCase = () => {
    navigate("/cases/add");
  };

  const handleViewCase = (caseId) => {
    navigate(`/cases/${caseId}`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredCases = cases.filter((caso) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      caso.title?.toLowerCase().includes(searchLower) ||
      caso.description?.toLowerCase().includes(searchLower) ||
      caso.responsible?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="bg-blue_dark shadow-xl rounded-lg p-4 mb-10 flex justify-between">
        <div className="text-center flex-1 border-r border-blue_primary">
          <h3 className="text-white font-medium">Casos em andamento</h3>
          <p className="text-white text-3xl font-bold">{stats.emAndamento}</p>
        </div>
        <div className="text-center flex-1 border-r border-blue_primary">
          <h3 className="text-white font-medium">Casos Arquivados</h3>
          <p className="text-white text-3xl font-bold">{stats.arquivados}</p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-white font-medium">Casos Concluídos</h3>
          <p className="text-white text-3xl font-bold">{stats.finalizados}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
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

        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_secondary"
        />
      </div>

      {/* Cases Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue_primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando casos...</p>
        </div>
      ) : (
        <div className="overflow-x-auto mb-10">
          <table className="w-full bg-blue_quaternary rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-blue_primary border-opacity-20">
                <th className="py-4 px-4 text-left text-white">Responsável</th>
                <th className="py-4 px-4 text-left text-white">Caso</th>
                <th className="py-4 px-4 text-center text-white">Status</th>
                <th className="py-4 px-4 text-center text-white">Data</th>
                <th className="py-4 px-4 text-right text-white">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caso) => (
                <tr
                  key={caso._id}
                  className="border-b border-blue_primary border-opacity-20 hover:bg-blue_dark transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-white">
                    <div className="flex items-center">
                      <User size={20} className="mr-2" />
                      {caso.responsible?.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white">
                    <div>
                      <span className="font-bold">#{caso._id.slice(-4)}</span>
                      <p className="text-sm">{caso.title}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        caso.status === "em_andamento"
                          ? "bg-yellow-500"
                          : caso.status === "finalizado"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      } text-white`}
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
                      {format(new Date(caso.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleViewCase(caso._id)}
                      className="bg-red_secondary hover:bg-opacity-90 text-white px-4 py-2 rounded-full inline-flex items-center mr-2"
                    >
                      <Eye size={16} className="mr-1" />
                      Visualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleAddCase}
          className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          NOVO CASO
        </button>
      </div>
    </div>
  );
};

export default Cases;
