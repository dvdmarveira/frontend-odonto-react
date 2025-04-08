import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, X } from "@phosphor-icons/react";

const AddCase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoCaso: "",
    numeroCaso: "",
    responsavel: "",
    data: "",
    status: "",
    descricao: "",
    historico: "",
    analises: "",
  });

  const [evidencias, setEvidencias] = useState([]);
  const [novaEvidencia, setNovaEvidencia] = useState({
    tipo: "Selecionar",
    uploads: [],
    descricao: "",
  });

  const [documentos, setDocumentos] = useState([]);
  const [novoDocumento, setNovoDocumento] = useState({
    tipo: "Selecionar",
    uploads: [],
    informacoes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNovaEvidenciaChange = (e) => {
    const { name, value } = e.target;
    setNovaEvidencia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNovoDocumentoChange = (e) => {
    const { name, value } = e.target;
    setNovoDocumento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEvidencia = () => {
    if (
      novaEvidencia.tipo === "Selecionar" ||
      !novaEvidencia.descricao.trim()
    ) {
      alert("Tipo e descrição da evidência são obrigatórios!");
      return;
    }

    setEvidencias((prev) => [...prev, { ...novaEvidencia, id: Date.now() }]);
    setNovaEvidencia({
      tipo: "Selecionar",
      uploads: [],
      descricao: "",
    });
  };

  const handleAddDocumento = () => {
    if (
      novoDocumento.tipo === "Selecionar" ||
      !novoDocumento.informacoes.trim()
    ) {
      alert("Tipo e informações do documento são obrigatórios!");
      return;
    }

    setDocumentos((prev) => [...prev, { ...novoDocumento, id: Date.now() }]);
    setNovoDocumento({
      tipo: "Selecionar",
      uploads: [],
      informacoes: "",
    });
  };

  const handleRemoveEvidencia = (id) => {
    setEvidencias((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleRemoveDocumento = (id) => {
    setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosCompletos = {
      ...formData,
      evidencias,
      documentos,
    };
    console.log("Dados do formulário:", dadosCompletos);
    navigate("/cases");
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        {/* Informações Gerais */}
        <h2 className="text-2xl font-bold mb-6">Informações Gerais</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative">
            <button
              type="button"
              className="bg-blue_secondary text-white px-4 py-2 rounded-full flex items-center"
            >
              Tipo de Caso <CaretDown size={16} className="ml-2" />
            </button>
            <select
              name="tipoCaso"
              value={formData.tipoCaso}
              onChange={handleChange}
              className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
            >
              <option value="">Selecionar</option>
              <option value="identificacao">Identificação</option>
              <option value="avaliacao">Avaliação</option>
              <option value="laudo">Laudo</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              name="numeroCaso"
              value={formData.numeroCaso}
              onChange={handleChange}
              placeholder="N° do Caso"
              className="bg-blue_secondary text-white px-4 py-2 rounded-full placeholder-white"
            />
          </div>

          <div>
            <input
              type="text"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              placeholder="Nome do Responsável"
              className="bg-blue_secondary text-white px-4 py-2 rounded-full placeholder-white"
            />
          </div>

          <div>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="bg-blue_secondary text-white px-4 py-2 rounded-full"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              className="bg-blue_secondary text-white px-4 py-2 rounded-full flex items-center"
            >
              Status <CaretDown size={16} className="ml-2" />
            </button>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
            >
              <option value="">Selecionar</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </div>
        </div>

        {/* Descrição do Caso */}
        <div className="mb-6">
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição do Caso"
            className="w-full p-4 bg-blue_tertiary border-none rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue_secondary h-32"
          ></textarea>
        </div>

        {/* Histórico */}
        <div className="mb-10">
          <textarea
            name="historico"
            value={formData.historico}
            onChange={handleChange}
            placeholder="Histórico:"
            className="w-full p-4 bg-blue_tertiary border-none rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue_secondary h-24"
          ></textarea>
        </div>

        {/* Evidências */}
        <h2 className="text-2xl font-bold mb-6">Evidências</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
          <div>
            <p className="text-gray-700 mb-2">Tipo de Evidência:</p>
            <div className="relative">
              <select
                name="tipo"
                value={novaEvidencia.tipo}
                onChange={handleNovaEvidenciaChange}
                className="appearance-none w-full bg-blue_secondary text-white py-2 px-4 rounded-full cursor-pointer pr-10"
              >
                <option>Selecionar</option>
                <option>Radiografia Panorâmica</option>
                <option>Radiografia Periapical</option>
                <option>Fotografia Intraoral</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <CaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-2">Upload de Imagem:</p>
            <div className="relative">
              <select
                name="upload"
                className="appearance-none w-full bg-blue_secondary text-white py-2 px-4 rounded-full cursor-pointer pr-10"
              >
                <option>Selecionar</option>
                <option>Deste Dispositivo</option>
                <option>Da Câmera</option>
                <option>Do Google Drive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <CaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddEvidencia}
              className="bg-blue_secondary hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full w-full"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Descrição de Evidências */}
        <div className="mb-6">
          <textarea
            name="descricao"
            value={novaEvidencia.descricao}
            onChange={handleNovaEvidenciaChange}
            placeholder="Descrição de Evidências"
            className="w-full p-4 bg-blue_tertiary border-none rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue_secondary h-24"
          ></textarea>
        </div>

        {/* Lista de Evidências Adicionadas */}
        {evidencias.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4">
              Evidências Adicionadas:
            </h3>
            <div className="space-y-4">
              {evidencias.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-blue_tertiary p-4 rounded-lg relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveEvidencia(ev.id)}
                    className="absolute top-2 right-2 text-white hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                  <p className="text-white">
                    <strong>Tipo:</strong> {ev.tipo}
                  </p>
                  <p className="text-white">
                    <strong>Descrição:</strong> {ev.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Análises e Comparações */}
        <h2 className="text-2xl font-bold mb-6">Análises e Comparações</h2>

        <div className="mb-10">
          <button
            type="button"
            className="mb-4 bg-blue_tertiary text-white px-6 py-3 rounded-lg hover:bg-opacity-90"
          >
            Adicionar Informações
          </button>
          <textarea
            name="analises"
            value={formData.analises}
            onChange={handleChange}
            placeholder="Adicione análises e comparações aqui"
            className="w-full p-4 bg-blue_tertiary border-none rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue_secondary h-24"
          ></textarea>
        </div>

        {/* Laudos e Documentações */}
        <h2 className="text-2xl font-bold mb-6">Laudos e Documentações</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
          <div>
            <p className="text-gray-700 mb-2">Tipo de Laudo:</p>
            <div className="relative">
              <select
                name="tipo"
                value={novoDocumento.tipo}
                onChange={handleNovoDocumentoChange}
                className="appearance-none w-full bg-blue_secondary text-white py-2 px-4 rounded-full cursor-pointer pr-10"
              >
                <option>Selecionar</option>
                <option>Laudo Pericial</option>
                <option>Relatório Técnico</option>
                <option>Parecer Odontológico</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <CaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-2">Upload de Arquivo:</p>
            <div className="relative">
              <select
                name="upload"
                className="appearance-none w-full bg-blue_secondary text-white py-2 px-4 rounded-full cursor-pointer pr-10"
              >
                <option>Selecionar</option>
                <option>Deste Dispositivo</option>
                <option>Da Câmera</option>
                <option>Do Google Drive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <CaretDown size={16} />
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddDocumento}
              className="bg-blue_secondary hover:bg-blue_primary text-white font-bold py-2 px-6 rounded-full w-full"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="mb-6">
          <textarea
            name="informacoes"
            value={novoDocumento.informacoes}
            onChange={handleNovoDocumentoChange}
            placeholder="Informações sobre o documento"
            className="w-full p-4 bg-blue_tertiary border-none rounded-lg text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue_secondary h-24"
          ></textarea>
        </div>

        {/* Lista de Documentos Adicionados */}
        {documentos.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4">
              Documentos Adicionados:
            </h3>
            <div className="space-y-4">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-blue_tertiary p-4 rounded-lg relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveDocumento(doc.id)}
                    className="absolute top-2 right-2 text-white hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                  <p className="text-white">
                    <strong>Tipo:</strong> {doc.tipo}
                  </p>
                  <p className="text-white">
                    <strong>Informações:</strong> {doc.informacoes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão Salvar */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-red_secondary hover:bg-opacity-90 text-white font-bold py-3 px-16 rounded-full transition-colors duration-200"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCase;
