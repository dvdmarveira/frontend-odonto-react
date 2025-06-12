import React from "react";
import SignaturePad from "../components/SignaturePad";
import { Link } from "react-router-dom";
import { ArrowLeft, Info } from "@phosphor-icons/react";
import { useAuth } from "../contexts/useAuth"; // Importa o hook de autenticação

const Profile = () => {
  const { user } = useAuth(); // Pega os dados do usuário logado

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/dashboard"
          className="text-sm text-blue_dark hover:underline flex items-center mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para o Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

        {/* Renderização condicional baseada na função do usuário */}
        {user && user.role === "perito" ? (
          <SignaturePad />
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="py-1">
                <Info size={24} className="text-yellow-500 mr-3" />
              </div>
              <div>
                <p className="font-bold">Funcionalidade Indisponível</p>
                <p className="text-sm">
                  A adição de assinatura é um recurso exclusivo para usuários
                  com a função de "Perito".
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
