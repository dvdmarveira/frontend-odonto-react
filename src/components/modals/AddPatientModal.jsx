// src/components/modals/AddPatientModal.jsx (Versão com todos os campos)
import React, { useState, useEffect } from "react";
import PatientService from "../../services/patients/patientService"; // Usando o serviço que já corrigimos
import { toast } from "react-hot-toast";

const AddPatientModal = ({
  isOpen,
  onClose,
  patientData = null,
  caseId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    nic: "",
    nome: "",
    genero: "Masculino",
    idade: "",
    documento: "", // Novo campo
    endereco: "", // Novo campo
    corEtnia: "", // Novo campo
    anotacoesAnatomicas: "", // Novo campo
    odontograma: "{}", // Odontograma como string JSON
    caseId: caseId || "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      if (patientData) {
        setFormData({
          nic: patientData.nic || "",
          nome: patientData.nome || "",
          genero: patientData.genero || "Masculino",
          idade: patientData.idade || "",
          documento: patientData.documento || "",
          endereco: patientData.endereco || "",
          corEtnia: patientData.corEtnia || "",
          anotacoesAnatomicas: patientData.anotacoesAnatomicas || "",
          odontograma: JSON.stringify(patientData.odontograma || {}, null, 2),
          caseId: patientData.case || caseId,
        });
      } else {
        setFormData({ ...initialState, caseId });
      }
    }
  }, [isOpen, patientData, caseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const finalData = {
        ...formData,
        odontograma: JSON.parse(formData.odontograma),
      };

      let result;
      if (patientData) {
        result = await PatientService.updatePatient(patientData._id, finalData);
      } else {
        result = await PatientService.createPatient(finalData);
      }

      if (result.success) {
        toast.success(
          patientData ? "Paciente atualizado!" : "Paciente criado!"
        );
        onSuccess();
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        error.message ||
          "Ocorreu um erro. Verifique o formato do JSON do odontograma."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {patientData ? "Editar Paciente" : "Adicionar Paciente ao Caso"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Nome *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label>NIC *</label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label>Idade *</label>
              <input
                type="number"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label>Gênero *</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            {/* --- NOVOS CAMPOS ADICIONADOS --- */}
            <div>
              <label>Documento (Ex: RG)</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>Cor/Etnia</label>
              <input
                type="text"
                name="corEtnia"
                value={formData.corEtnia}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label>Endereço Completo</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Anotações Anatômicas</label>
            <textarea
              name="anotacoesAnatomicas"
              value={formData.anotacoesAnatomicas}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>

          {/* --- CAMPO DO ODONTOGRAMA --- */}
          <div>
            <label>Odontograma (formato JSON)</label>
            <textarea
              name="odontograma"
              value={formData.odontograma}
              onChange={handleChange}
              className="w-full p-2 border rounded font-mono"
              rows="6"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Exemplo: {'{ "dente_11": "cariado", "dente_23": "ausente" }'}
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue_dark text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
