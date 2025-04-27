import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CaretDown } from "@phosphor-icons/react";
import imgSheila from "../../assets/imgs/photos-users/sheila.svg";
import SearchBar from "../../components/SearchBar";

const UserManagDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulando carregamento de dados da API
    setTimeout(() => {
      const mockUser = {
        id: userId,
        name: "Sheila Lins",
        role: "Assistente",
        avatar: (
          <img
            src={imgSheila}
            alt="Foto de Sheila"
            className="w-full h-full object-cover"
          />
        ),
      };

      const mockActivities = [
        {
          id: 1,
          description:
            "Adicionou fotografias intraorais e radiografias odontológicas.",
          date: "16/05/2025",
        },
        {
          id: 2,
          description:
            "Adicionou fotografias intraorais e radiografias odontológicas.",
          date: "23/05/2025",
        },
        {
          id: 3,
          description:
            "Adicionou fotografias intraorais e radiografias odontológicas.",
          date: "02/06/2025",
        },
        {
          id: 4,
          description:
            "Adicionou fotografias intraorais e radiografias odontológicas.",
          date: "10/07/2025",
        },
      ];

      setUser(mockUser);
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  }, [userId]);

  const handleViewActivityDetails = (activityId) => {
    navigate(`/admin/users/${userId}/activity/${activityId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">Carregando dados do usuário...</div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User Profile */}
      <div className="bg-blue_secondary text-white rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="relative w-[100x] h-[100px] rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
            {user.avatar}
          </div>
          <div className="ml-8">
            <h2 className="text-4xl font-bold mb-4">{user.name}</h2>
            <div className="flex items-center">
              <span className="mr-2">Função:</span>
              <div className="flex relative">
                <button className="bg-red_secondary hover:bg-opacity-90 text-white px-4 py-1 rounded-full flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white">
                  {user.role}
                  <CaretDown size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Histórico de Atividades</h3>

        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-[#a4c1d7] rounded-lg p-4 flex items-center justify-between"
            >
              <p className="text-[#212126]">{activity.description}</p>
              <div className="flex items-center">
                <button
                  className="bg-red_secondary hover:bg-opacity-90 text-white px-4 py-1 rounded-full mr-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red_secondary"
                  onClick={() => handleViewActivityDetails(activity.id)}
                >
                  Detalhes
                </button>
                <span>{activity.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-red_secondary hover:bg-opacity-90 text-white px-8 py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red_secondary">
            Ver mais
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagDetail;
