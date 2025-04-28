import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, X, Upload, Spinner } from "@phosphor-icons/react";
import { useAuth } from "../../contexts/useAuth";
import CaseService from "../../services/cases/caseService";
import EvidenceService from "../../services/evidences/evidenceService";
import ReportService from "../../services/reports/reportService";
import { toast } from "react-toastify";

const TIPOS_CASO = {
  Acidente: "acidente",
  Identificação: "identificacao",
  Criminal: "criminal",
};

const TIPOS_EVIDENCIA = [
  "Radiografia Panorâmica",
  "Radiografia Periapical",
  "Fotografia Intraoral",
];

const TIPOS_DOCUMENTO = [
  "laudo_pericial",
  "relatorio_tecnico",
  "parecer_odontologico",
];

const AddCase = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    status: "em_andamento",
    data: new Date().toISOString().split("T")[0],
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
    status: "rascunho",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = async (files, type, itemId) => {
    try {
      if (!files || files.length === 0) {
        toast.error("Nenhum arquivo selecionado");
        return;
      }

      // Validar tamanho dos arquivos (máximo 5MB cada)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const invalidFiles = Array.from(files).filter(
        (file) => file.size > maxSize
      );
      if (invalidFiles.length > 0) {
        toast.error("Alguns arquivos são muito grandes (máximo 5MB)");
        return;
      }

      setUploadProgress((prev) => ({
        ...prev,
        [itemId]: 0,
      }));

      if (type === "evidencia") {
        setNovaEvidencia((prev) => ({
          ...prev,
          uploads: [...prev.uploads, ...Array.from(files)],
        }));
      } else {
        setNovoDocumento((prev) => ({
          ...prev,
          uploads: [...prev.uploads, ...Array.from(files)],
        }));
      }

      // Simular progresso de upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress((prev) => ({
          ...prev,
          [itemId]: progress,
        }));
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress((prev) => ({
              ...prev,
              [itemId]: null,
            }));
          }, 1000);
        }
      }, 500);

      toast.success(`${files.length} arquivo(s) carregado(s) com sucesso!`);
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao fazer upload dos arquivos");
      setUploadProgress((prev) => ({
        ...prev,
        [itemId]: null,
      }));
    }
  };

  const handleAddEvidencia = async () => {
    try {
      if (
        novaEvidencia.tipo === "Selecionar" ||
        !novaEvidencia.descricao.trim()
      ) {
        toast.error("Tipo e descrição da evidência são obrigatórios!");
        return;
      }

      if (!TIPOS_EVIDENCIA.includes(novaEvidencia.tipo)) {
        toast.error("Tipo de evidência inválido!");
        return;
      }

      setLoading(true);
      const evidenciaId = Date.now();

      setEvidencias((prev) => [...prev, { ...novaEvidencia, id: evidenciaId }]);
      setNovaEvidencia({
        tipo: "Selecionar",
        uploads: [],
        descricao: "",
      });

      toast.success("Evidência adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar evidência:", error);
      toast.error("Erro ao adicionar evidência");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.type
      ) {
        throw new Error("Preencha todos os campos obrigatórios do caso");
      }

      if (!TIPOS_CASO[formData.type]) {
        throw new Error("Tipo de caso inválido");
      }

      if (formData.title.trim().length < 3) {
        throw new Error("O título deve ter pelo menos 3 caracteres");
      }

      if (formData.description.trim().length < 10) {
        throw new Error("A descrição deve ter pelo menos 10 caracteres");
      }

      // Criar o caso
      const caseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: TIPOS_CASO[formData.type],
        status: formData.status,
        data: formData.data,
        historico: formData.historico?.trim() || "",
        analises: formData.analises?.trim() || "",
      };

      console.log("Dados do caso a serem enviados:", caseData);
      const caseResponse = await CaseService.createCase(caseData);

      if (!caseResponse.success) {
        throw new Error(caseResponse.error);
      }

      const caseId = caseResponse.data._id;

      // 3. Upload das evidências
      const evidencePromises = evidencias.map(async (evidencia) => {
        const evidenceData = {
          type: evidencia.tipo,
          content: evidencia.descricao,
          files: evidencia.uploads,
          caseId,
        };

        const evidenceResponse = await EvidenceService.uploadEvidence(
          caseId,
          evidenceData
        );
        if (!evidenceResponse.success) {
          throw new Error(
            `Erro ao upload evidência: ${evidenceResponse.error}`
          );
        }
        return evidenceResponse;
      });

      // 4. Criar documentos/laudos
      const documentPromises = documentos.map(async (documento) => {
        const reportData = {
          caseId,
          title: documento.tipo,
          content: documento.informacoes || "Sem informações adicionais",
          type: documento.tipo.toLowerCase(),
          status: documento.status || "rascunho",
        };

        console.log("Dados do documento a serem enviados:", reportData);
        const reportResponse = await ReportService.createReport(reportData);

        if (!reportResponse.success) {
          throw new Error(`Erro ao criar laudo: ${reportResponse.error}`);
        }
        return reportResponse;
      });

      // 5. Aguardar todas as operações
      await Promise.all([...evidencePromises, ...documentPromises]);

      toast.success("Caso criado com sucesso!");
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.error("Erro ao criar caso:", error);
      toast.error(error.message || "Erro ao criar caso");
    } finally {
      setLoading(false);
    }
  };

  // Componente de Progresso
  const ProgressBar = ({ progress }) => {
    if (progress === null || progress === undefined) return null;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue_primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  const renderFileUploadButton = (type, itemId) => (
    <div className="relative">
      <input
        type="file"
        multiple
        onChange={(e) => handleFileUpload(e.target.files, type, itemId)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={loading}
        accept={type === "evidencia" ? "image/*,.pdf" : ".pdf,.doc,.docx"}
      />
      <button
        type="button"
        className="bg-blue_dark hover:bg-blue_primary text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
        disabled={loading}
      >
        <Upload size={20} />
        Upload
      </button>
      <ProgressBar progress={uploadProgress[itemId]} />
    </div>
  );

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Gerais */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue_primary">
            Informações Gerais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Caso*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Digite o título do caso"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Caso*
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary"
                required
                disabled={loading}
              >
                <option value="">Selecione o tipo</option>
                {Object.keys(TIPOS_CASO).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary"
                disabled={loading}
              >
                <option value="em_andamento">Em Andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Caso*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Digite a descrição detalhada do caso"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary h-24"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Histórico
              </label>
              <textarea
                name="historico"
                value={formData.historico}
                onChange={handleChange}
                placeholder="Histórico do caso"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary h-24"
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Análises
              </label>
              <textarea
                name="analises"
                value={formData.analises}
                onChange={handleChange}
                placeholder="Análises preliminares"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary h-24"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Evidências */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue_primary">
            Evidências
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evidência:
              </label>
              <select
                name="tipo"
                value={novaEvidencia.tipo}
                onChange={(e) =>
                  setNovaEvidencia((prev) => ({
                    ...prev,
                    tipo: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary appearance-none"
                disabled={loading}
              >
                <option value="Selecionar">Selecionar</option>
                {TIPOS_EVIDENCIA.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload de Imagem:
              </label>
              {renderFileUploadButton("evidencia", "nova-evidencia")}
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddEvidencia}
                className="bg-blue_dark hover:bg-blue_primary text-white font-semibold py-2 px-6 rounded-md w-fit flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Spinner className="animate-spin" size={20} />
                ) : null}
                Adicionar
              </button>
            </div>
          </div>

          <textarea
            name="descricao"
            value={novaEvidencia.descricao}
            onChange={(e) =>
              setNovaEvidencia((prev) => ({
                ...prev,
                descricao: e.target.value,
              }))
            }
            placeholder="Descrição da Evidência"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary h-24"
            disabled={loading}
          />
        </div>

        {/* Lista de Evidências */}
        {evidencias.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">
              Evidências Adicionadas:
            </h3>
            <div className="space-y-4">
              {evidencias.map((ev) => (
                <div
                  key={ev.id}
                  className="border border-gray-200 p-4 rounded-lg relative hover:shadow-md transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setEvidencias((prev) =>
                        prev.filter((e) => e.id !== ev.id)
                      )
                    }
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    disabled={loading}
                  >
                    <X size={20} />
                  </button>
                  <p className="font-medium">Tipo: {ev.tipo}</p>
                  <p className="text-gray-600">Descrição: {ev.descricao}</p>
                  {ev.uploads.length > 0 && (
                    <p className="text-gray-600">
                      Arquivos: {ev.uploads.length} arquivo(s)
                    </p>
                  )}
                  <ProgressBar progress={uploadProgress[ev.id]} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Laudos e Documentações */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue_primary">
            Laudos e Documentações
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento:
              </label>
              <select
                name="tipo"
                value={novoDocumento.tipo}
                onChange={(e) =>
                  setNovoDocumento((prev) => ({
                    ...prev,
                    tipo: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary appearance-none"
                disabled={loading}
              >
                <option value="Selecionar">Selecionar</option>
                {TIPOS_DOCUMENTO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload de Arquivo:
              </label>
              {renderFileUploadButton("documento", "novo-documento")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status:
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={novoDocumento.status}
                  onChange={(e) =>
                    setNovoDocumento((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary appearance-none"
                  disabled={loading}
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="arquivado">Arquivado</option>
                </select>
                <CaretDown
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informações do Documento:
            </label>
            <textarea
              name="informacoes"
              value={novoDocumento.informacoes}
              onChange={(e) =>
                setNovoDocumento((prev) => ({
                  ...prev,
                  informacoes: e.target.value,
                }))
              }
              placeholder="Descreva as informações relevantes do documento"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue_primary h-24"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setDocumentos((prev) => [...prev, novoDocumento])}
              className="bg-blue_dark hover:bg-blue_primary text-white font-semibold py-2 px-6 rounded-md flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner className="animate-spin" size={20} /> : null}
              Adicionar Documento
            </button>
          </div>
        </div>

        {/* Lista de Documentos */}
        {documentos.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">
              Documentos Adicionados:
            </h3>
            <div className="space-y-4">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 p-4 rounded-lg relative hover:shadow-md transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setDocumentos((prev) =>
                        prev.filter((d) => d.id !== doc.id)
                      )
                    }
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    disabled={loading}
                  >
                    <X size={20} />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Tipo: {doc.tipo}</p>
                      <p className="text-gray-600">Status: {doc.status}</p>
                    </div>
                    <div>
                      {doc.uploads.length > 0 && (
                        <p className="text-gray-600">
                          Arquivos Anexados: {doc.uploads.length}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Informações:</span>{" "}
                    {doc.informacoes}
                  </p>
                  <ProgressBar progress={uploadProgress[doc.id]} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/cases")}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue_primary text-white rounded-lg hover:bg-blue_secondary transition-colors flex items-center gap-2"
            disabled={loading}
          >
            {loading && <Spinner className="animate-spin" size={20} />}
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCase;
