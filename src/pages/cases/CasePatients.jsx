// src/pages/cases/CasePatients.jsx (Versão final com ícones nos detalhes)
import React, { useState, useEffect } from "react";
import {
  Plus,
  PencilSimple,
  Trash,
  CaretDown,
  CaretUp,
  Users,
  // --- ÍCONES NOVOS PARA OS DETALHES ---
  GenderIntersex,
  Cake,
  IdentificationCard,
  MapPin,
  NotePencil,
  Tooth,
} from "@phosphor-icons/react";
import PatientService from "../../services/patients/patientService";
import AddPatientModal from "../../components/modals/AddPatientModal";
import { toast } from "react-hot-toast";

// Componente interno para exibir os detalhes do paciente com ícones
const PatientDetails = ({ patient }) => {
  const formatKey = (key) => {
    return key.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const renderOdontogramValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <span className="text-gray-500 text-xs ml-2">
          ({" "}
          {Object.entries(value)
            .map(([key, val]) => `${formatKey(key)}: ${val}`)
            .join("; ")}{" "}
          )
        </span>
      );
    }
    return String(value);
  };
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex items-center gap-2">
          <GenderIntersex size={16} className="text-gray-500" />
          <strong>Gênero:</strong> {patient.genero}
        </div>
        <div className="flex items-center gap-2">
          <Cake size={16} className="text-gray-500" />
          <strong>Idade:</strong> {patient.idade}
        </div>
        <div className="flex items-center gap-2">
          <IdentificationCard size={16} className="text-gray-500" />
          <strong>Documento:</strong> {patient.documento || "N/A"}
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <strong>Cor/Etnia:</strong> {patient.corEtnia || "N/A"}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-gray-500" />
        <strong>Endereço:</strong> {patient.endereco || "N/A"}
      </div>
      <div className="flex items-start gap-2">
        <NotePencil size={16} className="text-gray-500 mt-0.5" />
        <strong>Anotações Anatômicas:</strong>{" "}
        <span className="flex-1">{patient.anotacoesAnatomicas || "N/A"}</span>
      </div>

      {patient.odontograma && Object.keys(patient.odontograma).length > 0 && (
        <div className="mt-2">
          <strong className="flex items-center gap-2 mb-1">
            <Tooth size={16} className="text-gray-500" />
            Odontograma:
          </strong>
          <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
            {Object.entries(patient.odontograma).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold">{formatKey(key)}:</span>
                {renderOdontogramValue(value)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CasePatients = ({ caseId }) => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [expandedPatientId, setExpandedPatientId] = useState(null);

  const loadPatients = async () => {
    /* ... (código inalterado) ... */
    if (!caseId) return;
    setIsLoading(true);
    const response = await PatientService.getPatientsByCase(caseId);
    if (response.success) {
      setPatients(response.data);
    } else {
      toast.error(response.error || "Erro ao carregar pacientes.");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    loadPatients();
  }, [caseId]);
  const handleToggleDetails = (patientId) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };
  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };
  const handleDeletePatient = async (patientId) => {
    /* ... (código inalterado) ... */
    if (!window.confirm("Tem certeza que deseja desvincular este paciente?"))
      return;
    const response = await PatientService.deletePatient(patientId);
    if (response.success) {
      toast.success("Paciente removido!");
      loadPatients();
    } else {
      toast.error(response.error || "Erro ao remover paciente.");
    }
  };
  const handleModalSuccess = () => {
    setIsModalOpen(false);
    loadPatients();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users size={24} className="text-blue_dark" />
          Pacientes do Caso
        </h2>
        <button
          onClick={handleAddPatient}
          className="bg-blue_dark text-white font-bold py-2 px-4 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Adicionar Paciente
        </button>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Nenhum paciente vinculado.
        </p>
      ) : (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="border p-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleToggleDetails(patient._id)}
                >
                  <div className="flex items-center">
                    <span className="font-semibold text-lg">
                      {patient.nome}
                    </span>
                    {expandedPatientId === patient._id ? (
                      <CaretUp className="ml-2 text-blue_dark" />
                    ) : (
                      <CaretDown className="ml-2 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">NIC: {patient.nic}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEditPatient(patient)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <PencilSimple size={24} />
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remover"
                  >
                    <Trash size={24} />
                  </button>
                </div>
              </div>
              {expandedPatientId === patient._id && (
                <PatientDetails patient={patient} />
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddPatientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          caseId={caseId}
          patientData={selectedPatient}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default CasePatients;
