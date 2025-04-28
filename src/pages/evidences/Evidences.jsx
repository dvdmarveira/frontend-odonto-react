import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Plus,
  Calendar,
  FileImage,
  Eye,
} from "@phosphor-icons/react";
import evidenceService from "../../services/evidences/evidenceService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const formatarData = (data) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="bg-blue_dark shadow-xl rounded-lg p-6 mb-10 flex justify-between">
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">
            Total de Evidências
          </h3>
          <p className="text-white text-4xl font-bold">
            {evidences?.length || 0}
          </p>
        </div>
        <div className="text-center flex-1 mx-4">
          <h3 className="text-white text-lg font-medium mb-2">Radiografias</h3>
          <p className="text-white text-4xl font-bold">
            {evidences?.filter(
              (ev) =>
                ev.type === "Radiografia Panorâmica" ||
                ev.type === "Radiografia Periapical"
            ).length || 0}
          </p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">Fotografias</h3>
          <p className="text-white text-4xl font-bold">
            {evidences?.filter((ev) => ev.type === "Fotografia Intraoral")
              .length || 0}
          </p>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar evidências..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_dark"
            />
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <button className="bg-blue_dark hover:bg-blue_primary text-white px-6 py-2 rounded-lg inline-flex items-center">
          <Plus size={20} className="mr-2" />
          Nova Evidência
        </button>
      </div>

      {/* Tabela de Evidências */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue_primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando evidências...</p>
        </div>
      ) : evidences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma evidência encontrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto mb-4">
          <table className="w-full bg-blue_quaternary rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white">
                <th className="py-4 px-6 text-left text-white font-medium">
                  Tipo
                </th>
                <th className="py-4 px-6 text-left text-white font-medium">
                  Descrição
                </th>
                <th className="py-4 px-6 text-center text-white font-medium">
                  Data
                </th>
                <th className="py-4 px-6 text-center text-white font-medium">
                  Arquivo
                </th>
                <th className="py-4 px-6 text-right text-white font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {evidences.map((evidence) => (
                <tr
                  key={evidence.id}
                  className="border-b border-white hover:bg-blue_dark transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FileImage size={20} className="mr-2 text-white" />
                      <span className="text-white font-medium">
                        {evidence.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white">{evidence.content}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center text-white">
                      <Calendar size={20} className="mr-2" />
                      {formatarData(evidence.createdAt)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {evidence.filePath ? (
                      <span className="text-green-400">Disponível</span>
                    ) : (
                      <span className="text-red-400">Indisponível</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="bg-[#DC3545] hover:bg-opacity-80 text-white px-4 py-2 rounded-full inline-flex items-center">
                      <Eye size={16} className="mr-2" />
                      Visualizar
                    </button>
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
