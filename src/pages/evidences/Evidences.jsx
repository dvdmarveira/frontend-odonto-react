import React, { useState, useEffect } from "react";
import evidenceService from "../../services/evidences/evidenceService";
import { toast } from "react-hot-toast";
import {
  MagnifyingGlass,
  Spinner,
  CaretDown,
  CaretUp,
  Camera,
  FileText,
  Briefcase,
  Archive,
  MapPin,
  WarningCircle,
} from "@phosphor-icons/react";

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

// Sub-componente que exibe todos os detalhes da evidência
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

// Componente principal da página
const Evidences = () => {
  const [evidences, setEvidences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEvidenceId, setExpandedEvidenceId] = useState(null);

  useEffect(() => {
    const fetchEvidences = async () => {
      setIsLoading(true);
      const response = await evidenceService.getEvidences();
      if (response.success) {
        setEvidences(response.data);
      } else {
        toast.error("Erro ao carregar evidências.");
      }
      setIsLoading(false);
    };
    fetchEvidences();
  }, []);

  const handleToggleDetails = (evidenceId) => {
    setExpandedEvidenceId(
      expandedEvidenceId === evidenceId ? null : evidenceId
    );
  };

  const filteredEvidences = evidences.filter(
    (e) =>
      e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.annotations &&
        e.annotations
          .join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (e.caseId?.title &&
        e.caseId.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Consultar Evidências
        </h1>
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tipo, anotação ou título do caso..."
            className="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm"
          />
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size={32} className="animate-spin text-blue_dark" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvidences.length > 0 ? (
              filteredEvidences.map((evidence) => (
                <div
                  key={evidence._id}
                  className="bg-white border p-4 rounded-lg shadow-sm"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleToggleDetails(evidence._id)}
                  >
                    <div className="flex items-center gap-3">
                      {evidence.type === "imagem" ? (
                        <Camera size={24} className="text-blue_primary" />
                      ) : (
                        <FileText size={24} className="text-blue_primary" />
                      )}
                      <div>
                        <p className="font-bold text-lg text-blue_dark capitalize">
                          {evidence.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          Adicionada em:{" "}
                          {new Date(evidence.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    </div>
                    {expandedEvidenceId === evidence._id ? (
                      <CaretUp size={20} />
                    ) : (
                      <CaretDown size={20} />
                    )}
                  </div>
                  {expandedEvidenceId === evidence._id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md mb-4">
                        <Briefcase size={16} className="text-blue-600" />
                        <strong>Caso Associado:</strong>{" "}
                        {evidence.caseId?.title || "Nenhum"}
                      </div>
                      <EvidenceDetails evidence={evidence} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhuma evidência encontrada.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evidences;
