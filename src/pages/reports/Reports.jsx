import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import reportService from "../../services/reports/reportService";
import { toast } from "react-toastify";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await reportService.getReports();
      if (success) {
        setReports(data);
      } else {
        toast.error(error || "Erro ao carregar laudos");
      }
    } catch (error) {
      console.error("Erro ao carregar laudos:", error);
      toast.error("Erro ao carregar laudos");
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
        placeholder="Pesquisar relatórios..."
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-blue_primary mb-4">Laudos</h2>
        <p className="text-gray-600 mb-6">
          Esta página permite a geração e visualização de laudos relacionados
          aos casos odontológicos forenses.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <p>Carregando laudos...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex justify-center items-center h-60 bg-gray-100 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum laudo encontrado</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.type}</p>
                <p className="text-sm text-gray-600">Status: {report.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
