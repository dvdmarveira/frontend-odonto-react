import { Outlet } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import peridentalLogo from "../assets/imgs/logo/peridentalLogo.svg";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Simula dados do usuário logado
  const user = {
    name: "Carlos",
    id: "#0000",
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue_secondary text-white py-2 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={peridentalLogo}
            alt="Logo Peridental"
            className="w-18 h-18"
          />
          <h1 className="text-2xl font-bold">Peridental</h1>
        </div>
        <div className="text-center">
          {location.pathname.includes("/admin/users") ? (
            <h2 className="text-xl font-bold">GESTÃO DE ACESSO</h2>
          ) : location.pathname.match(/\/cases\/\d+/) ? (
            <h2 className="text-xl font-bold">CASO DETALHADO</h2>
          ) : location.pathname === "/cases/add" ? (
            <h2 className="text-xl font-bold">NOVOS CASOS</h2>
          ) : (
            <h2 className="text-xl font-bold">GESTÃO ODONTO-LEGAL</h2>
          )}
        </div>
        <div className="w-[200px]">
          {/* Espaço vazio para manter o alinhamento */}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium text-gray_primary">
                Bem vindo, {user.name}
              </p>
              <p className="text-sm text-gray_primary">{user.id}</p>
            </div>
            <button
              className="text-sm text-red_secondary font-medium hover:underline"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
          <a
            href="#"
            className="text-sm text-gray_primary hover:text-blue_secondary block mb-4"
          >
            Alterar informações
          </a>

          <nav className="mt-6">
            <ul className="space-y-2">
              <li
                className={`border-b border-gray-200 py-2 ${
                  location.pathname === "/dashboard" ? "bg-blue-50" : ""
                }`}
              >
                <Link
                  to="/dashboard"
                  className={`block transition-colors duration-200 ${
                    location.pathname === "/dashboard"
                      ? "text-blue_secondary font-medium"
                      : "text-gray_primary hover:text-blue_secondary"
                  }`}
                >
                  Visão Geral
                </Link>
              </li>
              <li
                className={`border-b border-gray-200 py-2 ${
                  location.pathname === "/cases" ? "bg-blue-50" : ""
                }`}
              >
                <Link
                  to="/cases"
                  className={`block transition-colors duration-200 ${
                    location.pathname === "/cases"
                      ? "text-blue_secondary font-medium"
                      : "text-gray_primary hover:text-blue_secondary"
                  }`}
                >
                  Gestão de Casos
                </Link>
              </li>
              <li
                className={`border-b border-gray-200 py-2 ${
                  location.pathname === "/reports" ? "bg-blue-50" : ""
                }`}
              >
                <Link
                  to="/reports"
                  className={`block transition-colors duration-200 ${
                    location.pathname === "/reports"
                      ? "text-blue_secondary font-medium"
                      : "text-gray_primary hover:text-blue_secondary"
                  }`}
                >
                  Geração de Laudos Periciais
                </Link>
              </li>
              <li
                className={`border-b border-gray-200 py-2 ${
                  location.pathname.includes("/admin/users") ? "bg-blue-50" : ""
                }`}
              >
                <Link
                  to="/admin/users"
                  className={`block transition-colors duration-200 ${
                    location.pathname.includes("/admin/users")
                      ? "text-blue_secondary font-medium"
                      : "text-gray_primary hover:text-blue_secondary"
                  }`}
                >
                  Gestão de Acesso
                </Link>
              </li>
              <li
                className={`border-b border-gray-200 py-2 ${
                  location.pathname === "/evidences" ? "bg-blue-50" : ""
                }`}
              >
                <Link
                  to="/evidences"
                  className={`block transition-colors duration-200 ${
                    location.pathname === "/evidences"
                      ? "text-blue_secondary font-medium"
                      : "text-gray_primary hover:text-blue_secondary"
                  }`}
                >
                  Evidências
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-[#fbfbfb]">
          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
