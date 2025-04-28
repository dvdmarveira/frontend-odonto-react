import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import evidenceService from "../../services/evidences/evidenceService";
import { toast } from "react-toastify";

const Evidences = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidences();
  }, []);

  const loadEvidences = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await evidenceService.getEvidences();
      if (success) {
        setEvidences(data);
      } else {
        toast.error(error || "Erro ao carregar evidências");
      }
    } catch (error) {
      console.error("Erro ao carregar evidências:", error);
      toast.error("Erro ao carregar evidências");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pesquisar evidências..."
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-blue_primary mb-4">
          Gerenciamento de Evidências
        </h2>
        <p className="text-gray-600 mb-6">
          Esta página permite o gerenciamento de todas as evidências
          odontológicas relacionadas aos casos.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <p>Carregando evidências...</p>
          </div>
        ) : evidences.length === 0 ? (
          <div className="flex justify-center items-center h-60 bg-gray-100 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhuma evidência encontrada</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {evidences.map((evidence) => (
              <div key={evidence.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{evidence.type}</h3>
                <p className="text-sm text-gray-600">{evidence.content}</p>
                {evidence.filePath && (
                  <img
                    src={evidence.filePath}
                    alt="Evidência"
                    className="mt-2 max-w-xs rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evidences;
