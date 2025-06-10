// src/pages/cases/Cases.jsx (Versão Final Corrigida)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  Plus,
  Trash,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";
import CaseService from "../../services/cases/caseService";

const Cases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({
    emAndamento: 0,
    finalizados: 0,
    arquivados: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Função para calcular os stats a partir dos dados recebidos
  const calculateStats = (casesData) => {
    return casesData.reduce(
      (acc, caso) => {
        if (caso.status === "em_andamento") acc.emAndamento++;
        if (caso.status === "finalizado") acc.finalizados++;
        if (caso.status === "arquivado") acc.arquivados++;
        return acc;
      },
      { emAndamento: 0, finalizados: 0, arquivados: 0 }
    );
  };

  const loadCases = async (page = 1) => {
    setIsLoading(true);
    const response = await CaseService.getCases({}, page);

    // CORREÇÃO: Verifica se a resposta foi bem sucedida e tem dados
    if (response.success && response.data) {
      const casesData = response.data.cases || [];
      setCases(casesData);
      setPagination(response.data.pagination || {});

      // Calcula os stats localmente para evitar erros de 'null'
      const calculatedStats = calculateStats(casesData);
      setStats(calculatedStats);
    } else {
      toast.error(response.error || "Erro ao carregar casos.");
      setCases([]);
      setPagination({});
      setStats({ emAndamento: 0, finalizados: 0, arquivados: 0 });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm("Tem certeza que deseja excluir este caso?")) return;
    const response = await CaseService.deleteCase(caseId);
    if (response.success) {
      toast.success("Caso excluído com sucesso!");
      loadCases();
    } else {
      toast.error(response.error);
    }
  };

  // Filtra os casos com base na busca
  const filteredCases = cases.filter(
    (caso) =>
      caso.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.responsible?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatarData = (data) =>
    format(new Date(data), "dd/MM/yyyy", { locale: ptBR });

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue_dark shadow-lg rounded-lg p-6 text-white text-center">
          <h3 className="text-lg font-medium mb-2">Em Andamento</h3>
          <p className="text-4xl font-bold">{stats.emAndamento}</p>
        </div>
        <div className="bg-blue_dark shadow-lg rounded-lg p-6 text-white text-center">
          <h3 className="text-lg font-medium mb-2">Finalizados</h3>
          <p className="text-4xl font-bold">{stats.finalizados}</p>
        </div>
        <div className="bg-blue_dark shadow-lg rounded-lg p-6 text-white text-center">
          <h3 className="text-lg font-medium mb-2">Arquivados</h3>
          <p className="text-4xl font-bold">{stats.arquivados}</p>
        </div>
      </div>

      {/* Barra de Busca e Botão de Adicionar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título ou responsável..."
            className="w-full px-4 py-2 pl-10 rounded-lg bg-white border"
          />
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          onClick={() => navigate("/cases/add")}
          className="bg-blue_dark text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Caso
        </button>
      </div>

      {/* Tabela de Casos */}
      {isLoading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Título</th>
                <th className="px-6 py-3 text-left">Responsável</th>
                <th className="px-6 py-3 text-left">Data de Criação</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((caso) => (
                <tr key={caso._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{caso.title}</td>
                  <td className="px-6 py-4">{caso.responsible?.name}</td>
                  <td className="px-6 py-4">{formatarData(caso.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(
                        caso.status
                      )}`}
                    >
                      {caso.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-4">
                      <Link
                        to={`/cases/${caso._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver Detalhes"
                      >
                        <Eye size={22} weight="bold" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCase(caso._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir Caso"
                      >
                        <Trash size={22} weight="bold" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cases;
