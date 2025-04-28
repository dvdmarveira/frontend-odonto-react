import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";
import { getPatientsByCase } from "../../services/patients/patientService";
import PatientModal from "../../components/modals/PatientModal";

const CasePatients = () => {
  const { caseId } = useParams();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadPatients();
  }, [caseId]);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await getPatientsByCase(caseId);

      if (response.success) {
        setPatients(response.data);
      } else {
        toast.error(response.error || "Erro ao carregar pacientes");
      }
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  };

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

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchLower) ||
      patient.identificationStatus?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-red_secondary text-xl font-bold">
          Pacientes do Caso
        </h2>
        <button
          onClick={handleAddPatient}
          className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          ADICIONAR PACIENTE
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_primary"
          />
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="grid gap-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum paciente encontrado</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {patient.name || "Paciente não identificado"}
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        patient.name
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {patient.identificationStatus}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        patient.hasActiveCavities
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {patient.hasActiveCavities
                        ? "Com cáries ativas"
                        : "Sem cáries ativas"}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Número de dentes: <strong>{patient.numberOfTeeth}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Última atualização:{" "}
                    {new Date(patient.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleEditPatient(patient)}
                  className="text-blue_dark hover:text-blue_primary"
                >
                  <PencilSimple size={24} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        caseId={caseId}
        patientData={selectedPatient}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default CasePatients;
