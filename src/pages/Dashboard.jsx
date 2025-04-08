import { useState, useEffect } from "react";
import {
  ChartLine,
  Users,
  Briefcase,
  ClipboardText,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import SearchBar from "../components/SearchBar";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    totalUsers: 0,
    completedCases: 0,
  });

  const [recentCases, setRecentCases] = useState([]);

  useEffect(() => {
    // Simulação de carregamento de dados
    setTimeout(() => {
      setStats({
        totalCases: 145,
        activeCases: 38,
        totalUsers: 24,
        completedCases: 89,
      });

      setRecentCases([
        {
          id: "001",
          name: "Identificação Positiva",
          dentist: "Dr. João Silva",
          date: "05/04/2024",
          status: "Em andamento",
        },
        {
          id: "002",
          name: "Análise de Mordida",
          dentist: "Dra. Maria Oliveira",
          date: "03/04/2024",
          status: "Em andamento",
        },
        {
          id: "003",
          name: "Estimativa de Idade",
          dentist: "Dr. Carlos Santos",
          date: "01/04/2024",
          status: "Completo",
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ icon, title, value, bgColor }) => (
    <div className={`${bgColor} rounded-lg shadow-md p-6 flex flex-col`}>
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-white text-lg font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );

  if (isLoading) {
    return <div className="p-6 text-center">Carregando dados...</div>;
  }

  return (
    <div className="p-6">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pesquisar casos, laudos, usuários..."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue_primary rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total de Casos</h3>
          <p className="text-3xl font-bold">{stats.totalCases}</p>
        </div>

        <div className="bg-blue_secondary rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Casos Ativos</h3>
          <p className="text-3xl font-bold">{stats.activeCases}</p>
        </div>

        <div className="bg-blue_primary rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Usuários</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-blue_secondary rounded-lg shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Casos Concluídos</h3>
          <p className="text-3xl font-bold">{stats.completedCases}</p>
        </div>
      </div>

      {/* Recent Cases */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <ChartLine size={24} className="text-blue_primary mr-2" />
          <h3 className="text-lg font-semibold text-blue_primary">
            Casos Recentes
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Caso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dentista Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((caseItem, index) => (
                <tr
                  key={caseItem.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{caseItem.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {caseItem.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.dentist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        caseItem.status === "Completo"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
