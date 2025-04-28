import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  createPatient,
  updatePatient,
} from "../../services/patients/patientService";
import CaseService from "../../services/cases/caseService";

const AddPatientModal = ({
  isOpen,
  onClose,
  patientData = null,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    numberOfTeeth: 32,
    hasActiveCavities: false,
    caseId: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadCases();
    }
  }, [isOpen]);

  useEffect(() => {
    if (patientData) {
      setFormData({
        name: patientData.name || "",
        numberOfTeeth: patientData.numberOfTeeth,
        hasActiveCavities: patientData.hasActiveCavities,
        caseId: patientData.case?._id || "",
      });
    } else {
      setFormData({
        name: "",
        numberOfTeeth: 32,
        hasActiveCavities: false,
        caseId: "",
      });
    }
  }, [patientData]);

  const loadCases = async () => {
    try {
      const response = await CaseService.getCases();
      if (response.success) {
        // Filtrar apenas casos que não têm paciente vinculado ou o caso atual do paciente sendo editado
        const availableCases = response.data.cases.filter(
          (c) => !c.patient || c._id === patientData?.case?._id
        );
        setCases(availableCases);
      } else {
        toast.error("Erro ao carregar casos disponíveis");
      }
    } catch (error) {
      console.error("Erro ao carregar casos:", error);
      toast.error("Erro ao carregar casos disponíveis");
    }
  };

  const validateForm = () => {
    if (!formData.caseId) {
      toast.error("Por favor, selecione um caso");
      return false;
    }
    if (formData.numberOfTeeth < 0 || formData.numberOfTeeth > 32) {
      toast.error("O número de dentes deve estar entre 0 e 32");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      if (patientData) {
        const response = await updatePatient(patientData._id, formData);
        if (response.success) {
          toast.success("Paciente atualizado com sucesso");
          onSuccess && onSuccess();
          onClose();
        } else {
          toast.error(response.error || "Erro ao atualizar paciente");
        }
      } else {
        const response = await createPatient(formData);
        if (response.success) {
          toast.success("Paciente adicionado com sucesso");
          onSuccess && onSuccess();
          onClose();
        } else {
          // Tratamento específico para erro de caso já com paciente
          if (response.error?.includes("já possui um paciente")) {
            toast.error("Este caso já possui um paciente vinculado");
            // Recarregar a lista de casos para atualizar os disponíveis
            loadCases();
          } else {
            toast.error(response.error || "Erro ao adicionar paciente");
          }
        }
      }
    } catch (error) {
      console.error("Erro ao processar paciente:", error);
      toast.error(error.message || "Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {patientData ? "Editar Paciente" : "Adicionar Paciente"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Caso *
            </label>
            <select
              value={formData.caseId}
              onChange={(e) =>
                setFormData({ ...formData, caseId: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_primary"
              required
              disabled={!!patientData} // Desabilitar seleção de caso na edição
            >
              <option value="">Selecione um caso</option>
              {cases.map((caseItem) => (
                <option key={caseItem._id} value={caseItem._id}>
                  {caseItem.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome do Paciente
            </label>
            <input
              type="text"
              placeholder="Nome do paciente (opcional)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_primary"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Número de Dentes *
            </label>
            <input
              type="number"
              min="0"
              max="32"
              value={formData.numberOfTeeth}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfTeeth: parseInt(e.target.value) || 0,
                })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_primary"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.hasActiveCavities}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hasActiveCavities: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue_primary focus:ring-blue_primary"
              />
              <span className="text-gray-700 text-sm font-bold">
                Possui Cáries Ativas?
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue_dark hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? "Processando..."
                : patientData
                ? "Atualizar"
                : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
