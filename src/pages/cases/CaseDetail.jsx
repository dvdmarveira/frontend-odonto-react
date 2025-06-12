import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  DownloadSimple,
  ArrowLeft,
  Info,
  Scroll,
  PencilSimple,
  Spinner,
} from "@phosphor-icons/react";
import { toast } from "react-hot-toast";
import CaseService from "../../services/cases/caseService";
import ReportService from "../../services/reports/reportService";
import CasePatients from "./CasePatients";
import CaseEvidences from "./CaseEvidences";
import { useAuth } from "../../contexts/useAuth";

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário para checar a função (role)
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCaseDetails = async () => {
    setIsLoading(true);
    const response = await CaseService.getCaseById(caseId);

    if (response.success) {
      setCaseData(response.data);
    } else {
      toast.error(response.error || "Erro ao carregar detalhes do caso.");
      navigate("/cases");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (caseId) {
      loadCaseDetails();
    }
  }, [caseId]);

  const handleGenerateReport = async () => {
    toast.loading("Gerando laudo...");
    // Passa a função do usuário para o serviço
    const result = await ReportService.generateReportFromCase(
      caseId,
      user.role
    );

    toast.dismiss();

    if (result.success) {
      toast.success("Download do laudo iniciado!");
    } else {
      toast.error(result.error || "Falha ao gerar o laudo.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Spinner size={32} className="animate-spin text-blue_dark" />
        <p className="ml-4">Carregando detalhes do caso...</p>
      </div>
    );
  }

  if (!caseData) return <p className="p-6 text-center">Caso não encontrado.</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <Link
            to="/cases"
            className="text-sm text-blue_dark hover:underline flex items-center mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Voltar para a lista de casos
          </Link>
          <div className="md:flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800">
              {caseData.title}
              {/* CORRIGIDO */}
            </h1>
            <div className="flex gap-4 mt-4 md:mt-0">
              {user.role !== "assistente" && (
                <Link to={`/cases/${caseId}/edit`}>
                  <button className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-md border transition-colors">
                    <PencilSimple size={20} />
                    Editar Caso
                  </button>
                </Link>
              )}

              <button
                onClick={handleGenerateReport}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-transform hover:scale-105"
              >
                <DownloadSimple size={20} />
                Gerar Laudo (PDF)
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Card de Informações Gerais */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Info size={24} className="text-blue_dark" />
              Informações Gerais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-600">
              <p>
                <strong>Descrição:</strong> {caseData.description}
              </p>
              <p>
                <strong>Status:</strong> {caseData.status?.replace("_", " ")}
              </p>
              <p>
                <strong>Tipo:</strong> {caseData.type}
              </p>
              <p>
                <strong>Responsável:</strong>{" "}
                {caseData.responsible?.name || "Não atribuído"}
                {/* CORRIGIDO */}
              </p>
              <p>
                <strong>Histórico:</strong> {caseData.historico || "N/A"}
              </p>
              <p>
                <strong>Análises:</strong> {caseData.analises || "N/A"}
              </p>
            </div>
          </div>

          {/* Card de Pacientes */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <CasePatients caseId={caseId} />
          </div>

          {/* Card de Evidências */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <CaseEvidences
              caseId={caseId}
              evidences={caseData.evidences} /* CORRIGIDO */
              onEvidenceAdded={loadCaseDetails} /* CORRIGIDO */
            />
          </div>

          {/* Card de Histórico de Laudos */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <Scroll size={24} className="text-blue_dark" />
              Histórico de Laudos
            </h2>
            <p className="text-gray-500 mt-4">Em breve...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
