// src/pages/evidences/Evidences.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const Evidences = () => {
  const [evidences, setEvidences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvidences = async () => {
      setIsLoading(true);
      try {
        // Endpoint que lista todas as evidências
        const response = await api.get("/evidences");
        setEvidences(response.data.data);
      } catch (error) {
        toast.error("Erro ao carregar evidências.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvidences();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Consulta de Evidências</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Conteúdo/Descrição</th>
                <th className="px-6 py-3 text-left">Caso Vinculado</th>
                <th className="px-6 py-3 text-left">Enviado por</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {evidences.map((evidence) => (
                <tr key={evidence._id}>
                  <td className="px-6 py-4">{evidence.type}</td>
                  <td className="px-6 py-4">
                    {evidence.content || "Anexo de imagem"}
                  </td>
                  <td className="px-6 py-4">
                    {evidence.caseId?.title || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {evidence.uploadedBy?.name || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Evidences;
