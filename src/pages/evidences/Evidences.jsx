import React, { useState } from "react";
import SearchBar from "../../components/SearchBar";

const Evidences = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pesquisar evidências..."
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-blue_primary mb-4">
          Gerenciamento de Evidências
        </h2>
        <p className="text-gray-600 mb-6">
          Esta página permite o gerenciamento de todas as evidências
          odontológicas relacionadas aos casos.
        </p>

        <div className="flex justify-center items-center h-60 bg-gray-100 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            Conteúdo da página de Evidências em desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
};

export default Evidences;
