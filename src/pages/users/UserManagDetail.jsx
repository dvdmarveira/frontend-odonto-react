import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CaretDown, FloppyDisk, Trash, Spinner } from "@phosphor-icons/react";
import { toast } from "react-hot-toast";
import userService from "../../services/users/userService";
import * as activityLogService from "../../services/activityLogs";
import { useAuth } from "../../contexts/useAuth";

const UserManagDetail = () => {
  const { id: userId } = useParams(); // A rota usa :id
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth(); // Pega o usuário logado

  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega dados do usuário e atividades
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const userResponse = await userService.getUserById(userId);
      if (userResponse.success) {
        setUser(userResponse.data);
      } else {
        toast.error(userResponse.error);
        navigate("/admin/users");
      }

      const activityResponse = await activityLogService.getUserActivityLogs(
        userId
      );
      if (activityResponse.success) {
        setActivities(activityResponse.data);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [userId, navigate]);

  const handleRoleChange = (e) => {
    setUser({ ...user, role: e.target.value });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const response = await userService.updateUser(userId, { role: user.role });
    setIsSaving(false);

    if (response.success) {
      toast.success("Função do usuário atualizada com sucesso!");
    } else {
      toast.error(response.error);
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o usuário ${user.name}? Esta ação não pode ser desfeita.`
      )
    ) {
      setIsLoading(true);
      const response = await userService.deleteUser(userId);
      if (response.success) {
        toast.success("Usuário excluído com sucesso!");
        navigate("/admin/users");
      } else {
        toast.error(response.error);
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Spinner size={32} className="animate-spin text-blue_dark" />
        <p className="ml-4">Carregando dados do usuário...</p>
      </div>
    );
  }

  if (!user) return null;

  const canEdit = loggedInUser.role === "admin";
  const isSelf = loggedInUser._id === user._id;

  return (
    <div className="flex-1 p-6">
      {/* User Profile */}
      <div className="bg-blue_secondary text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-gray-200">
              <span className="text-4xl font-bold text-blue_dark">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="ml-8">
              <h2 className="text-4xl font-bold mb-4">{user.name}</h2>
              <p className="text-gray-200">{user.email}</p>
              <div className="flex items-center mt-4">
                <span className="mr-2">Função:</span>
                <div className="relative">
                  <select
                    value={user.role}
                    onChange={handleRoleChange}
                    disabled={!canEdit || isSelf} // Admin não pode alterar a própria role aqui
                    className="bg-red_secondary text-white px-4 py-1 rounded-full appearance-none disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option value="assistente">Assistente</option>
                    <option value="perito">Perito</option>
                    <option value="admin">Admin</option>
                  </select>
                  <CaretDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
          {canEdit && !isSelf && (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                {isSaving ? (
                  <Spinner size={20} className="animate-spin" />
                ) : (
                  <FloppyDisk size={20} />
                )}
                Salvar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isSaving}
                className="bg-red_secondary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Trash size={20} />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity History */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Histórico de Atividades</h3>
        {activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
              >
                <p className="text-gray-800">{activity.description}</p>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Nenhuma atividade registrada para este usuário.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserManagDetail;
