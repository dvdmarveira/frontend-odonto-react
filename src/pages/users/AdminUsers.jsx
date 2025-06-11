import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gear,
  MagnifyingGlass,
  UserPlus,
  Spinner,
  EyeSlash,
} from "@phosphor-icons/react";
import { toast } from "react-hot-toast";
import userService from "../../services/users/userService";
import { useAuth } from "../../contexts/useAuth";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const response = await userService.getUsers();
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        toast.error("Falha ao carregar usuários.");
        setUsers([]);
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ATUALIZAÇÃO: A função de navegação agora envia o objeto do usuário
  const handleNavigate = (user) => {
    navigate(`/admin/users/${user._id}/edit`, { state: { user } });
  };

  return (
    <div className="p-6">
      {/* Cabeçalho e Barra de Busca */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue_dark mb-6">Usuários</h1>
          {loggedInUser.role === "admin" && (
            <button
              onClick={() => navigate("/admin/users/new")}
              className="bg-blue_dark text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 hover:bg-opacity-90 transition-colors"
            >
              <UserPlus size={20} />
              Novo Usuário
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MagnifyingGlass size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou função..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue_primary"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Spinner
            size={48}
            className="animate-spin text-blue_primary mx-auto"
          />
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`bg-blue_secondary rounded-lg p-6 flex flex-col items-center relative hover:shadow-lg transition-shadow ${
                !user.isActive ? "opacity-50" : ""
              }`}
            >
              {loggedInUser.role === "admin" &&
                loggedInUser._id !== user._id && (
                  <button
                    onClick={() => handleNavigate(user)} // ATUALIZAÇÃO AQUI
                    className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
                    title="Editar Usuário"
                  >
                    <Gear size={24} />
                  </button>
                )}

              {!user.isActive && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                  <EyeSlash size={14} />
                  INATIVO
                </div>
              )}

              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center bg-gray-200">
                  <span className="text-4xl font-bold text-blue_dark">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-lg text-white mb-1">{user.name}</h3>
              <p className="text-white mb-4 capitalize">{user.role}</p>

              <button
                className="bg-red_secondary text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors"
                onClick={() => handleNavigate(user)} // ATUALIZAÇÃO AQUI
              >
                Gerenciar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
