import React, { useState, useEffect } from "react";
import patientService from "../../services/patients/patientService";
import { toast } from "react-hot-toast";
import {
  MagnifyingGlass,
  Spinner,
  CaretDown,
  CaretUp,
  Users,
  GenderIntersex,
  Cake,
  IdentificationCard,
  MapPin,
  NotePencil,
  Tooth,
  Briefcase,
} from "@phosphor-icons/react";

// Sub-componente para mostrar os detalhes do paciente quando expandido
const PatientDetails = ({ patient }) => {
  const formatKey = (key) => {
    return key.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const renderOdontogramValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <span className="text-gray-500 text-xs ml-2">
          (
          {Object.entries(value)
            .map(([key, val]) => `${formatKey(key)}: ${val}`)
            .join("; ")}
          )
        </span>
      );
    }
    return String(value);
  };
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-3">
      <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
        <Briefcase size={16} className="text-blue-600" />
        <strong>Caso Associado:</strong> {patient.case?.title || "Nenhum"}
      </div>
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
        <div>
          <strong className="flex items-center gap-2 mb-1">
            <Tooth size={16} className="text-gray-500" /> Odontograma:
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

// Componente principal da página
const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      const response = await patientService.getAllPatients();
      if (response.success) {
        setPatients(response.data);
      } else {
        toast.error("Erro ao carregar pacientes.");
      }
      setIsLoading(false);
    };
    fetchPatients();
  }, []);

  const handleToggleDetails = (patientId) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nic && p.nic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Consultar Pacientes
        </h1>
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou NIC..."
            className="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm"
          />
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size={32} className="animate-spin text-blue_dark" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="bg-white border p-4 rounded-lg shadow-sm"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleToggleDetails(patient._id)}
                  >
                    <div>
                      <p className="font-bold text-lg text-blue_dark">
                        {patient.nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        NIC: {patient.nic}
                      </p>
                    </div>
                    {expandedPatientId === patient._id ? (
                      <CaretUp size={20} />
                    ) : (
                      <CaretDown size={20} />
                    )}
                  </div>
                  {expandedPatientId === patient._id && (
                    <PatientDetails patient={patient} />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Nenhum paciente encontrado.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
