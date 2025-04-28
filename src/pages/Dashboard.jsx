import { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  FileImage,
  FileText,
  ChartLine,
  Calendar,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CaseService from "../services/cases/caseService";
import evidenceService from "../services/evidences/evidenceService";
import reportService from "../services/reports/reportService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    evidences: 0,
    reports: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Buscar casos
      const casesResponse = await CaseService.getCases();
      let totalCases = 0;
      let activeCases = 0;

      if (casesResponse.success && casesResponse.data?.cases) {
        totalCases = casesResponse.data.cases.length;
        activeCases = casesResponse.data.cases.filter(
          (caso) => caso.status === "em_andamento"
        ).length;
      }

      // Buscar evidências
      const evidencesResponse = await evidenceService.getEvidences();
      let totalEvidences = 0;
      if (evidencesResponse.success && evidencesResponse.data) {
        totalEvidences = evidencesResponse.data.length;
      }

      // Buscar laudos
      const reportsResponse = await reportService.getReports();
      let totalReports = 0;
      if (reportsResponse.success && reportsResponse.data) {
        totalReports = reportsResponse.data.length;
      }

      setStats({
        totalCases,
        activeCases,
        evidences: totalEvidences,
        reports: totalReports,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast.error("Erro ao carregar informações do dashboard");
      setStats({
        totalCases: 0,
        activeCases: 0,
        evidences: 0,
        reports: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (data) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue_primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue_dark mb-2">Visão Geral</h1>
        <p className="text-gray-600">
          Bem-vindo ao Sistema de Gestão de Casos de Odontologia Legal
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue_dark rounded-lg p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <Briefcase size={24} className="text-white" />
            <h3 className="text-white text-lg font-medium ml-2">
              Total de Casos
            </h3>
          </div>
          <p className="text-white text-3xl font-bold">{stats.totalCases}</p>
        </div>

        <div className="bg-blue_dark rounded-lg p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <ChartLine size={24} className="text-white" />
            <h3 className="text-white text-lg font-medium ml-2">
              Casos Ativos
            </h3>
          </div>
          <p className="text-white text-3xl font-bold">{stats.activeCases}</p>
        </div>

        <div className="bg-blue_dark rounded-lg p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <FileImage size={24} className="text-white" />
            <h3 className="text-white text-lg font-medium ml-2">Evidências</h3>
          </div>
          <p className="text-white text-3xl font-bold">{stats.evidences}</p>
        </div>

        <div className="bg-blue_dark rounded-lg p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <FileText size={24} className="text-white" />
            <h3 className="text-white text-lg font-medium ml-2">Laudos</h3>
          </div>
          <p className="text-white text-3xl font-bold">{stats.reports}</p>
        </div>
      </div>

      {/* Seção de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue_quaternary rounded-lg p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <Calendar size={24} className="text-white" />
            <h3 className="text-white text-lg font-medium ml-2">
              Atividades Recentes
            </h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-white">
                Novo caso de identificação adicionado
              </p>
              <p className="text-sm text-gray-300">
                {formatarData(new Date())}
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-white">Laudo pericial finalizado</p>
              <p className="text-sm text-gray-300">
                {formatarData(new Date())}
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-white">
                Novas evidências adicionadas ao caso #123
              </p>
              <p className="text-sm text-gray-300">
                {formatarData(new Date())}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue_quaternary rounded-lg p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <Users size={24} className="text-white" />
            <h3 className="text-white text-lg font-medium ml-2">
              Informações do Sistema
            </h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Sobre o Sistema</h4>
              <p className="text-gray-300">
                Sistema especializado para gestão de casos de odontologia legal,
                permitindo o gerenciamento de evidências, laudos e documentação
                pericial.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">
                Recursos Disponíveis
              </h4>
              <ul className="text-gray-300 list-disc list-inside">
                <li>Gestão de Casos</li>
                <li>Gerenciamento de Evidências</li>
                <li>Emissão de Laudos</li>
                <li>Análise de Documentos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
