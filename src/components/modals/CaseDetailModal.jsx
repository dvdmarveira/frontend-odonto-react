import React from "react";
import {
  X,
  Calendar,
  User,
  Tooth,
  FileImage,
  FileText,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CaseDetailModal = ({ isOpen, onClose, caseData }) => {
  if (!isOpen || !caseData) return null;

  console.log("Dados do caso no modal:", caseData);
  console.log("Dados do paciente no modal:", caseData.patient);

  const formatarData = (data) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-blue_dark text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            Detalhes do Caso #{caseData.id}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="p-8">
          {/* Informações Principais */}
          <div className="bg-blue_quaternary rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">
              {caseData.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center bg-white bg-opacity-10 p-4 rounded-lg">
                <div className="flex items-center text-white">
                  <span className="font-medium mr-2">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusColor(
                      caseData.status
                    )}`}
                  >
                    {caseData.status === "em_andamento"
                      ? "Em Andamento"
                      : caseData.status === "finalizado"
                      ? "Finalizado"
                      : "Arquivado"}
                  </span>
                </div>
              </div>

              <div className="flex items-center bg-white bg-opacity-10 p-4 rounded-lg">
                <Calendar size={20} className="mr-3 text-white" />
                <div className="text-white">
                  <span className="font-medium mr-2">Data de Abertura:</span>
                  {formatarData(caseData.createdAt)}
                </div>
              </div>

              <div className="flex items-center bg-white bg-opacity-10 p-4 rounded-lg">
                <User size={20} className="mr-3 text-white" />
                <div className="text-white">
                  <span className="font-medium mr-2">Responsável:</span>
                  {caseData.responsible?.name || "Não atribuído"}
                </div>
              </div>

              <div className="flex items-center bg-white bg-opacity-10 p-4 rounded-lg">
                <div className="text-white">
                  <span className="font-medium mr-2">Tipo:</span>
                  {caseData.type}
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          {caseData.description && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h4 className="text-lg font-bold text-blue_dark mb-4">
                Descrição
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {caseData.description}
              </p>
            </div>
          )}

          {/* Paciente Vinculado */}
          {caseData.patient && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <User size={24} className="text-blue_dark mr-2" />
                <h4 className="text-lg font-bold text-blue_dark">
                  Paciente Vinculado
                </h4>
              </div>
              <div className="bg-blue_dark rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="flex items-center text-white">
                      <User size={20} className="mr-3" />
                      <div>
                        <span className="font-medium block mb-1">Nome</span>
                        {caseData.patient.name || "Paciente não identificado"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="flex items-center text-white">
                      <Tooth size={20} className="mr-3" />
                      <div>
                        <span className="font-medium block mb-1">
                          Número de Dentes
                        </span>
                        {caseData.patient.numberOfTeeth}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-white">
                      <span className="font-medium block mb-2">
                        Status de Identificação
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          caseData.patient.name
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {caseData.patient.name
                          ? "Identificado"
                          : "Não Identificado"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                    <div className="text-white">
                      <span className="font-medium block mb-2">
                        Condição Dental
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          caseData.patient.hasActiveCavities
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {caseData.patient.hasActiveCavities
                          ? "Com cáries ativas"
                          : "Sem cáries ativas"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evidências */}
          {caseData.evidences && caseData.evidences.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileImage size={24} className="text-blue_dark mr-2" />
                <h4 className="text-lg font-bold text-blue_dark">
                  Evidências Vinculadas
                </h4>
              </div>
              <div className="bg-blue_dark rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white border-opacity-20">
                        <th className="py-4 px-6 text-left text-white font-medium">
                          Tipo
                        </th>
                        <th className="py-4 px-6 text-left text-white font-medium">
                          Descrição
                        </th>
                        <th className="py-4 px-6 text-center text-white font-medium">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseData.evidences.map((evidence) => (
                        <tr
                          key={evidence.id}
                          className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors"
                        >
                          <td className="py-4 px-6 text-white">
                            {evidence.type}
                          </td>
                          <td className="py-4 px-6 text-white">
                            {evidence.content}
                          </td>
                          <td className="py-4 px-6 text-white text-center">
                            {formatarData(evidence.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Documentos/Laudos */}
          {caseData.reports && caseData.reports.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText size={24} className="text-blue_dark mr-2" />
                <h4 className="text-lg font-bold text-blue_dark">
                  Laudos Vinculados
                </h4>
              </div>
              <div className="bg-blue_dark rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white border-opacity-20">
                        <th className="py-4 px-6 text-left text-white font-medium">
                          Título
                        </th>
                        <th className="py-4 px-6 text-left text-white font-medium">
                          Tipo
                        </th>
                        <th className="py-4 px-6 text-center text-white font-medium">
                          Data
                        </th>
                        <th className="py-4 px-6 text-center text-white font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseData.reports.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors"
                        >
                          <td className="py-4 px-6 text-white">
                            {report.title}
                          </td>
                          <td className="py-4 px-6 text-white">
                            {report.type}
                          </td>
                          <td className="py-4 px-6 text-white text-center">
                            {formatarData(report.createdAt)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${statusColor(
                                report.status
                              )}`}
                            >
                              {report.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Última Atualização */}
          <div className="bg-gray-50 rounded-xl p-4 mt-8 flex flex-col md:flex-row justify-between text-sm text-gray-600">
            <div className="mb-2 md:mb-0">
              <span className="font-bold">Última Atualização:</span>{" "}
              {formatarData(caseData.updatedAt)}
            </div>
            <div>
              <span className="font-bold">Atualizado por:</span>{" "}
              {caseData.updatedBy?.name || "Sistema"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailModal;
