// src/pages/patients/Patients.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { MagnifyingGlass } from "@phosphor-icons/react";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/patients"); // Endpoint que busca todos os pacientes
        setPatients(response.data.data);
      } catch (error) {
        toast.error("Erro ao carregar pacientes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Consulta de Pacientes</h1>
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou NIC..."
          className="w-full px-4 py-2 pl-10 rounded-lg bg-white border"
        />
        <MagnifyingGlass
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">NIC</th>
                <th className="px-6 py-3 text-left">Idade</th>
                <th className="px-6 py-3 text-left">Gênero</th>
                <th className="px-6 py-3 text-left">Caso Vinculado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td className="px-6 py-4">{patient.nome}</td>
                  <td className="px-6 py-4">{patient.nic}</td>
                  <td className="px-6 py-4">{patient.idade}</td>
                  <td className="px-6 py-4">{patient.genero}</td>
                  <td className="px-6 py-4">{patient.case?.title || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Patients;
