// src/pages/reports/Reports.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Endpoint que lista todos os laudos
        const response = await api.get("/reports");
        setReports(response.data.data);
      } catch (error) {
        toast.error("Erro ao carregar laudos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Consulta de Laudos</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Título</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Caso Vinculado</th>
                <th className="px-6 py-3 text-left">Criado por</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4">{report.title}</td>
                  <td className="px-6 py-4">{report.type}</td>
                  <td className="px-6 py-4">{report.status}</td>
                  <td className="px-6 py-4">{report.case?.title || "N/A"}</td>
                  <td className="px-6 py-4">
                    {report.createdBy?.name || "N/A"}
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

export default Reports;
