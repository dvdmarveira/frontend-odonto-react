import React, { useState } from "react";
import {
  Plus,
  Camera,
  FileText,
  Archive,
  MapPin,
  CaretDown,
  CaretUp,
  WarningCircle,
} from "@phosphor-icons/react";
import AddEvidenceForm from "../../components/AddEvidenceForm";
import { useAuth } from "../../contexts/useAuth";

// Componente para exibir a imagem e um estado de erro se ela não carregar
const ImageWithStatus = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-32 bg-gray-100 rounded-md flex flex-col items-center justify-center text-center p-2">
        <WarningCircle size={24} className="text-red-500 mb-1" />
        <span className="text-xs text-red-700">Falha ao carregar.</span>
        <span className="text-xs text-gray-500">Verifique o backend.</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-32 object-cover"
      onError={() => {
        console.error("ERRO: Falha ao carregar imagem no caminho:", src);
        setHasError(true);
      }}
    />
  );
};

// Componente que exibe todos os detalhes da evidência
const EvidenceDetails = ({ evidence }) => {
  const BACKEND_URL = "http://localhost:5000";

  const getImageUrl = (path) => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, "/");
    const filename = normalizedPath.substring(
      normalizedPath.lastIndexOf("/") + 1
    );
    return `${BACKEND_URL}/uploads/${filename}`;
  };

  const imagePaths = evidence.filePaths || evidence.files || [];

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
      {/* Seção de Imagens */}
      {evidence.type === "imagem" && imagePaths.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Imagens da Evidência
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imagePaths.map((filename, index) => (
              <a
                key={index}
                href={getImageUrl(filename)}
                target="_blank"
                rel="noopener noreferrer"
                className="block border rounded-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <ImageWithStatus
                  src={getImageUrl(filename)}
                  alt={`Evidência ${index + 1}`}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Seção de Conteúdo de Texto */}
      {evidence.type === "texto" && evidence.content && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Conteúdo do Texto
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-md whitespace-pre-wrap text-gray-800">
            {evidence.content}
          </p>
        </div>
      )}

      {/* Seção de Detalhes Adicionais */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Detalhes Adicionais
        </h4>
        <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-md space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Anotações:</span>
            <span className="text-right">
              {evidence.annotations?.join(", ") || (
                <i className="text-gray-400">N/A</i>
              )}
            </span>
          </div>
          {/* A EXIBIÇÃO DO ENDEREÇO FOI REMOVIDA DAQUI */}
          {evidence.location?.coordinates && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Coordenadas:</span>
              <span>
                {`Lat: ${evidence.location.coordinates[1]}, Lon: ${evidence.location.coordinates[0]}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CaseEvidences = ({ caseId, evidences = [], onEvidenceAdded }) => {
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState(null);
  const { user } = useAuth();

  const handleToggleDetails = (evidenceId) => {
    setExpandedEvidenceId(
      expandedEvidenceId === evidenceId ? null : evidenceId
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Archive size={24} className="text-blue_dark" />
          Evidências
        </h2>
        {user.role !== "assistente" && (
          <button
            onClick={() => setShowEvidenceForm(!showEvidenceForm)}
            className="bg-blue_dark text-white font-bold py-2 px-4 rounded-md flex items-center gap-2"
          >
            <Plus size={18} />
            {showEvidenceForm ? "Ocultar Formulário" : "Adicionar Evidência"}
          </button>
        )}
      </div>

      {showEvidenceForm && user.role !== "assistente" && (
        <AddEvidenceForm caseId={caseId} onEvidenceAdded={onEvidenceAdded} />
      )}

      <div className="mt-4 space-y-4">
        {evidences.length > 0 ? (
          evidences.map((evidence) => (
            <div
              key={evidence._id}
              className="border p-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div
                className="flex justify-between items-start cursor-pointer"
                onClick={() => handleToggleDetails(evidence._id)}
              >
                <div className="flex items-center gap-3">
                  {evidence.type === "imagem" ? (
                    <Camera size={24} className="text-blue_dark" />
                  ) : (
                    <FileText size={24} className="text-blue_dark" />
                  )}
                  <div>
                    <span className="font-bold text-lg capitalize">
                      {evidence.type}
                    </span>
                    <p className="text-xs text-gray-500">
                      Adicionada em:{" "}
                      {new Date(evidence.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                {expandedEvidenceId === evidence._id ? (
                  <CaretUp className="text-blue_dark" />
                ) : (
                  <CaretDown className="text-gray-500" />
                )}
              </div>

              {expandedEvidenceId === evidence._id && (
                <EvidenceDetails evidence={evidence} />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            Nenhuma evidência vinculada a este caso.
          </p>
        )}
      </div>
    </div>
  );
};

export default CaseEvidences;
