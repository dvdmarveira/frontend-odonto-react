import React from "react";
import {
  X,
  User,
  Tooth,
  Target,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";

const PatientMatchModal = ({ isOpen, onClose, matchResults }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-blue_dark text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Target size={24} className="mr-2" />
            Análise de Correspondências
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="p-6">
          {matchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Nenhuma correspondência encontrada com o limite mínimo de
                similaridade.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {matchResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
                >
                  {/* Cabeçalho da Comparação */}
                  <div className="bg-blue_dark text-white p-4">
                    <h3 className="text-lg font-bold">
                      Análise de Similaridade #{index + 1}
                    </h3>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Grid de Comparação */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Paciente Não Identificado */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                          <User size={20} className="text-blue_dark mr-2" />
                          <h4 className="font-medium">
                            Paciente Não Identificado
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <Tooth size={18} className="text-gray-500 mr-2" />
                              <span>Número de Dentes</span>
                            </div>
                            <span>
                              {result.unidentifiedPatient.numberOfTeeth} dentes
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>Status de Cáries</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                result.unidentifiedPatient.hasActiveCavities
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {result.unidentifiedPatient.hasActiveCavities
                                ? "Com cáries"
                                : "Sem cáries"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>Status</span>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                              Não Identificado
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Paciente Identificado */}
                      {result.matches.map((match, matchIndex) => (
                        <div
                          key={matchIndex}
                          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <User size={20} className="text-blue_dark mr-2" />
                              <h4 className="font-medium">
                                {match.patient.name}
                              </h4>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                match.similarityScore >= 80
                                  ? "bg-green-100 text-green-800"
                                  : match.similarityScore >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {match.similarityScore}% similar
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center">
                                <Tooth
                                  size={18}
                                  className="text-gray-500 mr-2"
                                />
                                <span>Número de Dentes</span>
                              </div>
                              <div className="flex items-center">
                                {match.comparisonDetails.teeth.matches ? (
                                  <CheckCircle
                                    size={18}
                                    className="text-green-500 mr-2"
                                  />
                                ) : (
                                  <XCircle
                                    size={18}
                                    className="text-red-500 mr-2"
                                  />
                                )}
                                <span>
                                  {match.patient.numberOfTeeth} dentes
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>Status de Cáries</span>
                              <div className="flex items-center">
                                {match.comparisonDetails.caries.matches ? (
                                  <CheckCircle
                                    size={18}
                                    className="text-green-500 mr-2"
                                  />
                                ) : (
                                  <XCircle
                                    size={18}
                                    className="text-red-500 mr-2"
                                  />
                                )}
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    match.patient.hasActiveCavities
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {match.patient.hasActiveCavities
                                    ? "Com cáries"
                                    : "Sem cáries"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span>Status</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Identificado
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legenda */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <p className="font-medium mb-2">
                        Critérios de Similaridade:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Número de dentes idêntico: 40% da pontuação</li>
                        <li>Status de cáries igual: 30% da pontuação</li>
                        <li>Status de identificação: 30% da pontuação</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMatchModal;
