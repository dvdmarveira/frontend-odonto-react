import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Plus,
  Calendar,
  FileText,
  Eye,
  User,
} from "@phosphor-icons/react";
import reportService from "../../services/reports/reportService";
import CaseService from "../../services/cases/caseService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CaseDetailModal from "../../components/modals/CaseDetailModal";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await reportService.getReports();
      if (success) {
        setReports(data);
      } else {
        toast.error(error || "Erro ao carregar laudos");
      }
    } catch (error) {
      console.error("Erro ao carregar laudos:", error);
      toast.error("Erro ao carregar laudos");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "rascunho":
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
      return "Data inválida";
    }
  };

  const handleViewCase = async (caseId) => {
    try {
      setLoading(true);

      if (!caseId) {
        toast.error("Caso não encontrado para este laudo");
        return;
      }

      // Validar o formato do ID
      const validId = caseId.toString().match(/^[0-9a-fA-F]{22,24}$/);
      if (!validId) {
        console.error("ID inválido:", caseId);
        toast.error("ID do caso em formato inválido");
        return;
      }

      const response = await CaseService.getCaseById(caseId);
      if (response.success) {
        setSelectedCase(response.data);
        setIsCaseModalOpen(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="bg-blue_dark shadow-xl rounded-lg p-6 mb-10 flex justify-between">
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">
            Total de Laudos
          </h3>
          <p className="text-white text-4xl font-bold">
            {reports?.length || 0}
          </p>
        </div>
        <div className="text-center flex-1 mx-4">
          <h3 className="text-white text-lg font-medium mb-2">Em Rascunho</h3>
          <p className="text-white text-4xl font-bold">
            {reports?.filter((rep) => rep.status === "rascunho").length || 0}
          </p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">Finalizados</h3>
          <p className="text-white text-4xl font-bold">
            {reports?.filter((rep) => rep.status === "finalizado").length || 0}
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
              placeholder="Buscar laudos..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_dark"
            />
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <button className="bg-blue_dark hover:bg-blue_primary text-white px-6 py-2 rounded-lg inline-flex items-center">
          <Plus size={20} className="mr-2" />
          Novo Laudo
        </button>
      </div>

      {/* Tabela de Laudos */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue_primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando laudos...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum laudo encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto mb-4">
          <table className="w-full bg-blue_quaternary rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white">
                <th className="py-4 px-6 text-left text-white font-medium">
                  Título
                </th>
                <th className="py-4 px-6 text-left text-white font-medium">
                  Responsável
                </th>
                <th className="py-4 px-6 text-center text-white font-medium">
                  Data
                </th>
                <th className="py-4 px-6 text-center text-white font-medium">
                  Status
                </th>
                <th className="py-4 px-6 text-right text-white font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-white hover:bg-blue_dark transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FileText size={20} className="mr-2 text-white" />
                      <span className="text-white font-medium">
                        {report.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <User size={20} className="mr-2 text-white" />
                      <span className="text-white">
                        {report.createdBy?.name || "Não atribuído"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center text-white">
                      <Calendar size={20} className="mr-2" />
                      {formatarData(report.createdAt)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${statusColor(
                        report.status
                      )}`}
                    >
                      {report.status === "rascunho"
                        ? "Rascunho"
                        : report.status === "finalizado"
                        ? "Finalizado"
                        : "Arquivado"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleViewCase(report.case?._id)}
                      className="bg-[#DC3545] hover:bg-opacity-80 text-white px-4 py-2 rounded-full inline-flex items-center"
                    >
                      <Eye size={16} className="mr-2" />
                      Visualizar Caso
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Case Detail Modal */}
      <CaseDetailModal
        isOpen={isCaseModalOpen}
        onClose={() => {
          setIsCaseModalOpen(false);
          setSelectedCase(null);
        }}
        caseData={selectedCase}
      />
    </div>
  );
};

export default Reports;
