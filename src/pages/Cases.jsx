import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import {
  MagnifyingGlass,
  Plus,
  Eye,
  PencilSimple,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [evidenceType, setEvidenceType] = useState("Radiografia Panorâmica");
  const [uploadMethod, setUploadMethod] = useState("Deste Dispositivo");
  const [caseName, setCaseName] = useState("");
  const navigate = useNavigate();

  // Simula carregamento de casos de uma API
  useEffect(() => {
    // Em produção, esta seria uma chamada para uma API real
    setTimeout(() => {
      const mockCases = [
        {
          id: 102,
          responsavel: "Dr. Marcos Almeida",
          descricao: "Identificação de Vítima de Acidente Rodoviário",
          data: "10/08/2024",
        },
        {
          id: 56,
          responsavel: "Dra. Luísa Lima",
          descricao: "Identificação de Vítima Carbonizada",
          data: "12/01/2025",
        },
        {
          id: 99,
          responsavel: "Dr. Bruno Silva",
          descricao: "Exame de Vítima de Afogamento",
          data: "04/12/2024",
        },
        {
          id: 86,
          responsavel: "Dr. Marcos Almeida",
          descricao: "Identificação de Vítima de Homicídio",
          data: "20/10/2024",
        },
      ];
      setCases(mockCases);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddCase = () => {
    console.log("Adicionar novo caso");
    navigate("/cases/add");
  };

  const handleAddEvidence = () => {
    console.log("Adicionar evidência");
  };

  const handleViewCase = (caseId) => {
    console.log(`Visualizar caso ${caseId}`);
    navigate(`/cases/${caseId}`);
  };

  return (
    <div className="p-6">
      {/* Search Bar and Add Button */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="w-3/4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar casos..."
          />
        </div>

      </div> */}

      {/* Stats Cards */}
      <div className="bg-blue_dark shadow-xl rounded-lg p-4 mb-20 flex justify-between">
        <div className="text-center flex-1 border-r border-blue_primary">
          <h3 className="text-white font-medium">Casos em andamento</h3>
          <p className="text-white text-3xl font-bold">102</p>
        </div>
        <div className="text-center flex-1 border-r border-blue_primary">
          <h3 className="text-white font-medium">Casos Arquivados</h3>
          <p className="text-white text-3xl font-bold">30</p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-white font-medium">Casos Concluídos</h3>
          <p className="text-white text-3xl font-bold">60</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex">
        <div className="flex-1">
          <button className="bg-blue_secondary hover:bg-blue_primary text-white font-medium py-2 px-6 rounded-full mr-2">
            Responsável
          </button>
          <button className="bg-blue_secondary hover:bg-blue_primary text-white font-medium py-2 px-6 rounded-full mr-2">
            Status
          </button>
          <button className="bg-blue_secondary hover:bg-blue_primary text-white font-medium py-2 px-6 rounded-full">
            Data
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <div>
            <button className="bg-blue_secondary hover:bg-blue_primary text-white font-medium py-2 px-6 rounded-full flex items-center">
              <MagnifyingGlass size={18} className="mr-2" />
              Buscar
            </button>
          </div>
          <div>
            <button
              onClick={handleAddCase}
              className="bg-blue_secondary hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Caso
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando casos...</p>
        </div>
      ) : (
        <div className="overflow-x-auto mb-14">
          <table className="w-full bg-blue_tertiary rounded-lg overflow-hidden">
            <tbody>
              {cases.map((caso) => (
                <tr
                  key={caso.id}
                  className="border-b border-blue_primary border-opacity-20"
                >
                  <td className="py-4 px-4 font-bold text-white">
                    {caso.responsavel}
                  </td>
                  <td className="py-4 px-4 text-white">
                    <span className="font-bold">Caso N° {caso.id}</span> -{" "}
                    {caso.descricao}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-white">
                    {caso.data}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleViewCase(caso.id)}
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
      )}

      {/* Evidences Section */}
      <h2 className="text-2xl font-bold text-blue_dark text-start mb-4">
        Gestão de Evidências
      </h2>

      <div className="bg-blue_tertiary rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="relative mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  placeholder="Nome do Caso"
                  className="w-full mt-7 border-b-2 border-gray-300 text-white placeholder-white py-2 bg-transparent outline-none"
                />
                <button className="ml-2">
                  <PencilSimple size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-bold mb-2">
                Tipo de Evidência:
              </label>
              <div className="relative">
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="appearance-none w-full bg-red_secondary text-white py-2 px-4 rounded-full cursor-pointer"
                >
                  <option>Radiografia Panorâmica</option>
                  <option>Radiografia Periapical</option>
                  <option>Fotografia Intraoral</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">
                Upload da Imagem:
              </label>
              <div className="relative">
                <select
                  value={uploadMethod}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="appearance-none w-full bg-red_secondary text-white py-2 px-4 rounded-full cursor-pointer"
                >
                  <option>Deste Dispositivo</option>
                  <option>Da Câmera</option>
                  <option>Do Google Drive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAddEvidence}
            className="bg-blue_secondary hover:bg-blue_primary text-white font-bold py-3 px-10 rounded-full"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cases;
