// src/pages/cases/CaseEvidences.jsx (Versão final com endereço e link do mapa)
import React, { useState } from "react";
import {
  Plus,
  Camera,
  FileText,
  Archive,
  MapPin,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import AddEvidenceForm from "../../components/AddEvidenceForm";

// Componente interno para mostrar os detalhes da evidência
const EvidenceDetails = ({ evidence }) => {
  // A URL do seu servidor backend para servir as imagens
  const BACKEND_URL = "http://localhost:5000";

  const getImageUrl = (path) => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, "/");
    return `${BACKEND_URL}/uploads/${normalizedPath}`;
  };

  const generateMapsLink = () => {
    const baseUrl = "https://www.google.com/maps/search/?api=1&query=";
    if (evidence.location?.coordinates?.length === 2) {
      const [longitude, latitude] = evidence.location.coordinates;
      return `${baseUrl}${latitude},${longitude}`;
    }
    if (evidence.address) {
      return `${baseUrl}${encodeURIComponent(evidence.address)}`;
    }
    return null;
  };

  const mapsLink = generateMapsLink();

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-3">
      {/* Exibição para IMAGENS */}
      {evidence.type === "imagem" && evidence.filePaths?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {evidence.filePaths.map((filePath, index) => (
            <a
              key={index}
              href={getImageUrl(filePath)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={getImageUrl(filePath)}
                alt={`Evidência ${index + 1}`}
                className="w-full h-32 object-cover rounded-md shadow-md hover:scale-105 transition-transform"
              />
            </a>
          ))}
        </div>
      )}

      {/* Exibição para TEXTO */}
      {evidence.type === "texto" && (
        <p className="bg-gray-100 p-3 rounded-md my-2 whitespace-pre-wrap">
          {evidence.content}
        </p>
      )}

      {/* Anotações e Localização */}
      {evidence.annotations?.length > 0 && (
        <p>
          <strong>Anotações:</strong> {evidence.annotations.join(", ")}
        </p>
      )}

      {(evidence.address || mapsLink) && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <p>
              <strong>Local:</strong> {evidence.address || "Coordenadas GPS"}
            </p>
          </div>
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 text-xs font-semibold"
            >
              Ver no Mapa
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const CaseEvidences = ({ caseId, evidences = [], onEvidenceAdded }) => {
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState(null);

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
        <button
          onClick={() => setShowEvidenceForm(!showEvidenceForm)}
          className="bg-blue_dark text-white font-bold py-2 px-4 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          {showEvidenceForm ? "Ocultar Formulário" : "Adicionar Evidência"}
        </button>
      </div>

      {showEvidenceForm && (
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
