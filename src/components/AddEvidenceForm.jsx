// src/components/AddEvidenceForm.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";

// Importando o serviço de evidências que já corrigimos
import EvidenceService from "../services/evidences/evidenceService";

const AddEvidenceForm = ({ caseId, onEvidenceAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("imagem");
  const [content, setContent] = useState("");
  const [annotations, setAnnotations] = useState("");
  const [files, setFiles] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setType("imagem");
    setContent("");
    setAnnotations("");
    setFiles([]);
    setLatitude("");
    setLongitude("");
    setAddress("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Cria o FormData para enviar os dados, incluindo arquivos
    const formData = new FormData();
    formData.append("caseId", caseId);
    formData.append("type", type);

    // Adiciona os campos opcionais apenas se tiverem valor
    if (content) formData.append("content", content);
    if (annotations) formData.append("annotations", annotations);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);
    if (address) formData.append("address", address);

    // Adiciona os arquivos selecionados
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // Chama o serviço para fazer o upload da evidência
    const result = await EvidenceService.uploadEvidence(formData);

    if (result.success) {
      toast.success("Evidência adicionada com sucesso!");
      resetForm(); // Limpa o formulário
      if (onEvidenceAdded) {
        onEvidenceAdded(); // Atualiza a lista de evidências na página de detalhes
      }
    } else {
      const errorMessage =
        result.error || "Ocorreu um erro ao adicionar evidência.";
      setError(errorMessage);
      toast.error(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="border border-gray-200 p-6 rounded-lg my-4 bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Adicionar Nova Evidência</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Evidência*
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="imagem">Imagem</option>
              <option value="texto">Texto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Anotações (separadas por vírgula)
            </label>
            <input
              type="text"
              value={annotations}
              onChange={(e) => setAnnotations(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
        </div>

        {type === "imagem" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Arquivos de Imagem*
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
        )}

        {type === "texto" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Conteúdo do Texto*
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full mt-1 p-2 border rounded"
            ></textarea>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude (Opcional)
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude (Opcional)
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Endereço (Opcional)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue_dark text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Salvar Evidência"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvidenceForm;
