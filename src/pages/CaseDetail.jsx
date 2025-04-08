import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  Download,
  PencilSimple,
  Trash,
  Plus,
} from "@phosphor-icons/react";

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulando carregamento de dados da API
    setTimeout(() => {
      const mockCaseData = {
        id: caseId || "045",
        title: "Identificação de Indivíduo Desconhecido",
        status: "Em Andamento",
        openDate: "12/03/2023",
        openTime: "21:56:28",
        expert: "Dr. Marcos Almeida",
        type: "Identificação Odonto-Legal",
        generalInfo:
          "Um corpo foi encontrado em avançado estado de decomposição em uma área rural nos arredores de Recife. Como não havia documentos ou qualquer outro meio de identificação imediato, a perícia odontológica foi solicitada para comparar os registros dentários com bancos de dados forenses.",
        occurrence: {
          location: "Zona rural de Recife, PE",
          discoveryDate: "12/01/2023",
          history:
            "Testemunhas afirmam que a vítima pode estar desaparecida há pelo menos duas semanas.",
        },
        evidences: [
          {
            id: 1,
            caseNumber: "045",
            description: "RX Panorâmico da Arcada Superior e Inferior",
            date: "10/03/2024",
          },
          {
            id: 2,
            caseNumber: "045",
            description: "Depoimento de Maria Eduardo Alves",
            date: "12/01/2023",
          },
          {
            id: 3,
            caseNumber: "045",
            description: "RX Comparativo com Registros de Banco de Dados",
            date: "04/12/2024",
          },
          {
            id: 4,
            caseNumber: "045",
            description: "Relato do Perito Bruno Silva",
            date: "20/10/2024",
          },
        ],
        analyses: [
          {
            id: 1,
            description:
              "Comparação da arcada dentária com registros de desaparecidos nos últimos 3 meses",
            date: "16/03/2025",
          },
          {
            id: 2,
            description:
              "Análise de correspondência com prontuários odontológicos enviados por familiares",
            date: "16/03/2025",
          },
          {
            id: 3,
            description: "Consulta ao Banco Nacional Odonto-Legal",
            date: "16/03/2025",
          },
        ],
        partialResult: [
          "Alta compatibilidade com um indivíduo desaparecido há 18 dias, identificado como João Carlos Ribeiro, 29 anos.",
          "Registro odontológico fornecido pela família confirma a extração recente do siso, fortalecendo a hipótese de identificação.",
        ],
        resultAddedBy: "Dr. Marcos Almeida",
        documents: [
          {
            id: 1,
            title: "Relatório de Comparação Odonto-Legal",
            status: "Em andamento",
            annexDate: "Nenhum anexo",
          },
          {
            id: 2,
            title: "Registro Fotográfico das Evidências e RX Panorâmica",
            status: "Anexado",
            annexDate: "16/03/2025",
          },
          {
            id: 3,
            title: "Depoimento de Maria Ribeiro",
            status: "Anexado",
            annexDate: "14/03/2025",
          },
        ],
        comments: [
          {
            id: 1,
            text: "A análise preliminar sugere forte compatibilidade entre a vítima e João Carlos Ribeiro, desaparecido desde 23/02/2025. O cruzamento de informações odontológicas reforça essa hipótese. O laudo oficial será finalizado após revisão da equipe.",
            author: "André Alves (Equipe Pericial)",
          },
        ],
        lastUpdate: "17/03/2025 - 14h32",
        updatedBy: "Dr. Marcos Almeida",
      };

      setCaseData(mockCaseData);
      setIsLoading(false);
    }, 800);
  }, [caseId]);

  const handleEditCase = () => {
    console.log("Editar caso");
  };

  const handleDeleteCase = () => {
    if (window.confirm("Tem certeza que deseja excluir este caso?")) {
      console.log("Excluir caso");
      navigate("/cases");
    }
  };

  const handleDownloadReport = () => {
    console.log("Download do relatório");
  };

  const handleAddEvidence = () => {
    console.log("Adicionar evidência");
  };

  const handleViewEvidence = (evidenceId) => {
    console.log(`Visualizar evidência ${evidenceId}`);
  };

  const handleAddDocument = () => {
    console.log("Adicionar documento");
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>Carregando dados do caso...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Action Buttons */}
      <div className="flex justify-between mb-8">
        <button
          onClick={handleEditCase}
          className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full"
        >
          EDITAR CASO
        </button>
        <button
          onClick={handleDeleteCase}
          className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full"
        >
          EXCLUIR CASO
        </button>
        <button
          onClick={handleDownloadReport}
          className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full"
        >
          BAIXAR RELATÓRIO
        </button>
      </div>

      {/* Case Header */}
      <div className="mb-6">
        <h2 className="text-red_secondary text-xl font-bold mb-4">
          Caso Pericial N° {caseData.id} - {caseData.title}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <span className="font-bold">Status Atual:</span> {caseData.status}
            </p>
            <p>
              <span className="font-bold">Data e hora de Abertura:</span>{" "}
              {caseData.openDate} {caseData.openTime}
            </p>
          </div>
          <div>
            <p>
              <span className="font-bold">Perito Responsável:</span>{" "}
              {caseData.expert}
            </p>
            <p>
              <span className="font-bold">Tipo de Caso:</span> {caseData.type}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* General Info Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Informações Gerais do Caso</h3>
        <p className="text-gray-700 mb-4">{caseData.generalInfo}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p>
              <span className="font-bold">Local de Ocorrência:</span>{" "}
              {caseData.occurrence.location}
            </p>
            <p>
              <span className="font-bold">Data da Descoberta do Corpo:</span>{" "}
              {caseData.occurrence.discoveryDate}
            </p>
          </div>
          <div>
            <p>
              <span className="font-bold">Histórico:</span>{" "}
              {caseData.occurrence.history}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Evidences Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Evidências Vinculadas ao Caso</h3>
          <button
            onClick={handleAddEvidence}
            className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full flex items-center"
          >
            <Plus size={18} className="mr-2" />
            ADICIONAR EVIDÊNCIA
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-blue_tertiary rounded-lg overflow-hidden">
            <tbody>
              {caseData.evidences.map((evidence) => (
                <tr
                  key={evidence.id}
                  className="border-b border-blue_primary border-opacity-20"
                >
                  <td className="py-4 px-4 text-white">
                    Caso Pericial N°{evidence.caseNumber}
                  </td>
                  <td className="py-4 px-4 text-white">
                    {evidence.description}
                  </td>
                  <td className="py-4 px-4 text-center text-white">
                    {evidence.date}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleViewEvidence(evidence.id)}
                      className="bg-red_secondary hover:bg-opacity-90 text-white px-4 py-1 rounded-full inline-flex items-center"
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
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Analysis Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Análises e Comparações</h3>
        <p className="mb-3">Foram realizados os seguintes procedimentos:</p>

        <ol className="list-decimal list-inside pl-4 mb-4">
          {caseData.analyses.map((analysis) => (
            <li key={analysis.id} className="mb-1">
              {analysis.description}
              <span className="text-red_secondary ml-3">({analysis.date})</span>
            </li>
          ))}
        </ol>

        {/* Partial Result */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">Resultado Parcial</h3>
          <div className="bg-blue_tertiary text-white p-6 rounded-lg">
            <ul className="list-disc list-inside">
              {caseData.partialResult.map((result, index) => (
                <li key={index} className="mb-2">
                  {result}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right text-sm">
              Adicionado por: {caseData.resultAddedBy}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Documents Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Laudos e Documentação</h3>
          <button
            onClick={handleAddDocument}
            className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full flex items-center"
          >
            <Plus size={18} className="mr-2" />
            ADICIONAR
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-blue_tertiary rounded-lg overflow-hidden">
            <tbody>
              {caseData.documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-blue_primary border-opacity-20"
                >
                  <td className="py-4 px-4 text-white">{doc.title}</td>
                  <td className="py-4 px-4 text-white">{doc.annexDate}</td>
                  <td className="py-4 px-4 text-right">
                    {doc.status === "Anexado" ? (
                      <button className="bg-red_secondary hover:bg-opacity-90 text-white px-4 py-1 rounded-full inline-flex items-center">
                        <Eye size={16} className="mr-1" />
                        Visualizar
                      </button>
                    ) : (
                      <span className="bg-red_secondary bg-opacity-30 text-white px-4 py-1 rounded-full">
                        Em andamento
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Comments Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Comentários:</h3>

        {caseData.comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-blue_dark text-white p-6 rounded-lg mb-4"
          >
            <p className="mb-3">{comment.text}</p>
            <p className="text-right text-sm">
              Adicionado por: {comment.author}
            </p>
          </div>
        ))}
      </div>

      {/* Last Update */}
      <div className="text-sm text-gray-600 mt-10 flex justify-between">
        <div>
          <span className="font-bold">Última Atualização:</span>{" "}
          {caseData.lastUpdate}
        </div>
        <div>
          <span className="font-bold">Atualizado por:</span>{" "}
          {caseData.updatedBy}
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
