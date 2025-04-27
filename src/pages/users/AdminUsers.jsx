import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gear } from "@phosphor-icons/react";
import SearchBar from "../../components/SearchBar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simula o carregamento de usuários de uma API
  useEffect(() => {
    // Em produção, esta seria uma chamada para uma API real
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          name: "Luiza Souza",
          role: "Assistente",
          avatar: "/src/assets/imgs/photos-users/luiza.svg",
        },
        {
          id: 2,
          name: "Sheila Lins",
          role: "Administradora",
          avatar: "/src/assets/imgs/photos-users/sheila.svg",
        },
        {
          id: 3,
          name: "Diego Bastos",
          role: "Administrador",
          avatar: "/src/assets/imgs/photos-users/diego.svg",
        },
        {
          id: 4,
          name: "Bruno Silva",
          role: "Perito",
          avatar: "/src/assets/imgs/photos-users/bruno.svg",
        },
        {
          id: 5,
          name: "Milena Passos",
          role: "Perita",
          avatar: "/src/assets/imgs/photos-users/milena.svg",
        },
        {
          id: 6,
          name: "Juan Paiva",
          role: "Assistente",
          avatar: "/src/assets/imgs/photos-users/juan.svg",
        },
      ];
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtro de usuários com base no termo de pesquisa
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando usuários...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p>Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-blue_secondary rounded-lg p-6 flex flex-col items-center relative"
            >
              <button className="absolute top-2 right-2 text-white">
                <Gear size={24} />
              </button>

              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                  <img
                    src={user.avatar}
                    alt={`Foto de ${user.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22120%22%20height%3D%22120%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e30c084b1%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e30c084b1%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%23eee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2243.5%22%20y%3D%2265.5%22%3E120x120%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                    }}
                  />
                </div>
              </div>

              <h3 className="font-bold text-lg text-white mb-1">{user.name}</h3>
              <p className="text-white mb-4">{user.role}</p>

              <button
                className="bg-red_secondary text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors"
                onClick={() => handleViewUserDetails(user.id)}
              >
                Ver mais
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
