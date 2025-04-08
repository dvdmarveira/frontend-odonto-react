import React, { useState } from "react";
import SearchBar from "../components/SearchBar";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pesquisar relatórios..."
      />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-blue_primary mb-4">
          Geração de Laudos Periciais
        </h2>
        <p className="text-gray-600 mb-6">
          Esta página permite a geração e visualização de relatórios
          relacionados aos casos odontológicos forenses.
        </p>

        <div className="flex justify-center items-center h-60 bg-gray-100 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            Conteúdo da página de Relatórios em desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
