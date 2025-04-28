import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  Eye,
  Plus,
  PencilSimple,
  User,
  Tooth,
  Target,
} from "@phosphor-icons/react";
import { toast } from "react-hot-toast";
import { getAllPatients } from "../../services/patients/patientService";
import AddPatientModal from "../../components/modals/AddPatientModal";
import CaseDetailModal from "../../components/modals/CaseDetailModal";
import PatientMatchModal from "../../components/modals/PatientMatchModal";
import CaseService from "../../services/cases/caseService";
import PatientMatchService from "../../services/patients/patientMatchService";

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  total: 0,
  pages: 1,
};

const DEFAULT_STATS = {
  identificados: 0,
  naoIdentificados: 0,
  comCaries: 0,
  semCaries: 0,
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [isSearchingMatches, setIsSearchingMatches] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [pagination.currentPage]);

  const calculateStats = (patientsData) => {
    return patientsData.reduce(
      (acc, patient) => {
        if (patient.name) acc.identificados++;
        else acc.naoIdentificados++;

        if (patient.hasActiveCavities) acc.comCaries++;
        else acc.semCaries++;

        return acc;
      },
      { identificados: 0, naoIdentificados: 0, comCaries: 0, semCaries: 0 }
    );
  };

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPatients(pagination.currentPage);

      if (response.success) {
        const patientsData = response.data || [];
        setPatients(patientsData);

        // Calcular estatísticas
        const calculatedStats = calculateStats(patientsData);
        setStats(calculatedStats);

        setPagination(response.pagination || DEFAULT_PAGINATION);
      } else {
        toast.error(response.error || "Erro ao buscar pacientes");
        setStats(DEFAULT_STATS);
        setPagination(DEFAULT_PAGINATION);
      }
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      toast.error("Erro ao carregar os pacientes");
      setStats(DEFAULT_STATS);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const filteredPatients = patients.filter((patient) => {
    if (!patient) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchLower) ||
      patient.identificationStatus?.toLowerCase().includes(searchLower) ||
      patient.case?.title?.toLowerCase().includes(searchLower)
    );
  });

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleModalSuccess = () => {
    loadPatients();
    handleModalClose();
  };

  const handleViewCase = async (caseId) => {
    try {
      setIsLoading(true);

      if (!caseId) {
        toast.error("ID do caso não fornecido");
        return;
      }

      const response = await CaseService.getCaseById(caseId);

      if (response.success) {
        setSelectedCase(response.data);
        setIsCaseModalOpen(true);
      } else {
        toast.error(response.error || "Erro ao carregar detalhes do caso");
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do caso:", error);
      toast.error("Erro ao carregar detalhes do caso");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindMatches = async () => {
    try {
      setIsSearchingMatches(true);
      const results = await PatientMatchService.findAllMatches(patients);
      setMatchResults(results);
      setIsMatchModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar correspondências:", error);
      toast.error("Erro ao buscar correspondências entre pacientes");
    } finally {
      setIsSearchingMatches(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue_primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="bg-blue_dark shadow-xl rounded-lg p-6 mb-10 flex justify-between">
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">
            Pacientes Identificados
          </h3>
          <p className="text-white text-4xl font-bold">{stats.identificados}</p>
        </div>
        <div className="text-center flex-1 mx-4">
          <h3 className="text-white text-lg font-medium mb-2">
            Não Identificados
          </h3>
          <p className="text-white text-4xl font-bold">
            {stats.naoIdentificados}
          </p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-white text-lg font-medium mb-2">Com Cáries</h3>
          <p className="text-white text-4xl font-bold">{stats.comCaries}</p>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_dark"
            />
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <button
          onClick={handleFindMatches}
          disabled={isSearchingMatches}
          className="bg-blue_secondary hover:bg-opacity-90 text-white px-6 py-2 rounded-lg inline-flex items-center disabled:opacity-50"
        >
          <Target size={20} className="mr-2" />
          {isSearchingMatches ? "Buscando..." : "Buscar Correspondências"}
        </button>

        <button
          onClick={handleAddPatient}
          className="bg-blue_dark hover:bg-blue_primary text-white px-6 py-2 rounded-lg inline-flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Novo Paciente
        </button>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto mb-4">
          <table className="w-full bg-blue_quaternary rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white">
                <th className="py-4 px-6 text-left text-white font-medium">
                  Paciente
                </th>
                <th className="py-4 px-6 text-left text-white font-medium">
                  Caso Vinculado
                </th>
                <th className="py-4 px-6 text-center text-white font-medium">
                  Status
                </th>
                <th className="py-4 px-6 text-center text-white font-medium">
                  Dentes
                </th>
                <th className="py-4 px-6 text-center text-white font-medium">
                  Cáries
                </th>
                <th className="py-4 px-6 text-right text-white font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient._id}
                  className="border-b border-white hover:bg-blue_dark transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <User size={20} className="mr-2 text-white" />
                      <span className="text-white font-medium">
                        {patient.name || "Paciente não identificado"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      to={`/cases/${patient.case?._id}`}
                      className="text-white hover:text-blue_secondary"
                    >
                      {patient.case?.title || "N/A"}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.name
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {patient.identificationStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center text-white">
                      <Tooth size={20} className="mr-2" />
                      {patient.numberOfTeeth}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.hasActiveCavities
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {patient.hasActiveCavities ? "Com cáries" : "Sem cáries"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="bg-blue_secondary hover:bg-opacity-80 text-white p-2 rounded-full"
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        onClick={() => handleViewCase(patient.case?._id)}
                        className="bg-[#DC3545] hover:bg-opacity-80 text-white p-2 rounded-full flex items-center"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Mostrando {filteredPatients.length} de {pagination.total} pacientes
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            <CaretLeft size={20} />
          </button>
          <span className="px-4 py-2 text-gray-700">
            Página {pagination.currentPage} de {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.pages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            <CaretRight size={20} />
          </button>
        </div>
      </div>

      {/* Case Detail Modal */}
      <CaseDetailModal
        isOpen={isCaseModalOpen}
        onClose={() => {
          setIsCaseModalOpen(false);
          setSelectedCase(null);
        }}
        caseData={selectedCase}
      />

      {/* Modal de Adicionar/Editar Paciente */}
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        patientData={selectedPatient}
        onSuccess={handleModalSuccess}
      />

      <PatientMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        matchResults={matchResults}
      />
    </div>
  );
};

export default Patients;
