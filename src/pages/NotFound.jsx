import React from "react";
import { Link } from "react-router-dom";
import { Warning } from "@phosphor-icons/react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Warning
          size={96}
          weight="fill"
          className="text-red_secondary mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-blue_primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/dashboard" className="btn-primary">
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
