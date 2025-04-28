import React from "react";
import { X, Calendar, User } from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CaseDetailModal = ({ isOpen, onClose, caseData }) => {
  if (!isOpen || !caseData) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue_dark">
            Detalhes do Caso #{caseData.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Informações Principais */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-red_secondary mb-4">
              {caseData.title}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="font-bold mr-2">Status:</span>
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

              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-gray-500" />
                <span className="font-bold mr-2">Data de Abertura:</span>
                {formatarData(caseData.createdAt)}
              </div>

              <div className="flex items-center">
                <User size={20} className="mr-2 text-gray-500" />
                <span className="font-bold mr-2">Responsável:</span>
                {caseData.responsible?.name || "Não atribuído"}
              </div>

              <div>
                <span className="font-bold mr-2">Tipo:</span>
                {caseData.type}
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Descrição */}
          {caseData.description && (
            <div className="mb-6">
              <h4 className="text-md font-bold mb-2">Descrição</h4>
              <p className="text-gray-700">{caseData.description}</p>
            </div>
          )}

          {/* Evidências */}
          {caseData.evidences && caseData.evidences.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <div className="mb-6">
                <h4 className="text-md font-bold mb-4">
                  Evidências Vinculadas
                </h4>
                <div className="bg-blue_quaternary rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {caseData.evidences.map((evidence) => (
                        <tr
                          key={evidence.id}
                          className="border-b border-blue_primary border-opacity-20"
                        >
                          <td className="py-3 px-4 text-white">
                            {evidence.type}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {evidence.content}
                          </td>
                          <td className="py-3 px-4 text-white text-center">
                            {formatarData(evidence.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Documentos/Laudos */}
          {caseData.reports && caseData.reports.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <div className="mb-6">
                <h4 className="text-md font-bold mb-4">Laudos Vinculados</h4>
                <div className="bg-blue_quaternary rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {caseData.reports.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-blue_primary border-opacity-20"
                        >
                          <td className="py-3 px-4 text-white">
                            {report.title}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {report.type}
                          </td>
                          <td className="py-3 px-4 text-white text-center">
                            {formatarData(report.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-white text-center">
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
            </>
          )}

          {/* Última Atualização */}
          <div className="mt-8 text-sm text-gray-600 flex justify-between">
            <div>
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
