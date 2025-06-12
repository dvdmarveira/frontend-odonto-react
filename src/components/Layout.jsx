import { Link, useLocation, useNavigate } from "react-router-dom";
import peridentalLogo from "../assets/imgs/logo/peridentalLogo.svg";
import { Question, UserCircle } from "@phosphor-icons/react";
import { useAuth } from "../contexts/useAuth";
import Dashboard from "../components/Dashboard/Dashboard.jsx";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, hasPermission } = useAuth();

  const getPageTitle = () => {
    if (location.pathname.includes("/users")) return "GESTÃO DE ACESSO";
    if (location.pathname.match(/\/cases\/\d+/)) return "CASO DETALHADO";
    if (location.pathname === "/cases/add") return "NOVOS CASOS";
    if (location.pathname === "/dashboard") return "VISÃO GERAL";
    return "GESTÃO ODONTO-LEGAL";
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue_quaternary text-white py-2 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={peridentalLogo}
            alt="Logo Peridental"
            className="w-18 h-18"
          />
          <h1 className="text-2xl font-bold">Peridental</h1>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{getPageTitle()}</h2>
        </div>
        <div className="text-center absolute right-8 cursor-pointer">
          <Question size={32} className="text-white hover:text-blue_dark" />
        </div>
        <div className="w-[200px]">
          {/* Espaço vazio para manter o alinhamento */}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <UserCircle size={32} className="text-gray_primary mr-2" />
              <div>
                <p className="font-medium text-gray_primary">{user?.name}</p>
                <p className="text-sm text-gray_primary">
                  {user?.role === "admin"
                    ? "Administrador"
                    : user?.role === "perito"
                    ? "Perito"
                    : "Assistente"}
                </p>
              </div>
            </div>
            <button
              className="text-sm text-red_secondary font-medium hover:underline"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>

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

              {hasPermission("view_cases") && (
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
              )}

              <li
                className={`border-b border-gray-200 py-2 ${
                  location.pathname.startsWith("/dashboard/novo")
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <Link
                  to="/dashboard/novo"
                  className={`block transition-colors duration-200 ${location.pathname.startsWith("/dashboard/novo")
                      ? "text-blue_secondary font-medium"
                      : "text-gray_primary hover:text-blue_secondary"
                    }`}
                >
                  Dashboard
                </Link>
              </li>

              {hasPermission("manage_users") && (
                <li
                  className={`border-b border-gray-200 py-2 ${
                    location.pathname.includes("/admin/users")
                      ? "bg-blue-50"
                      : ""
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
              )}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-[#fbfbfb]">
          {/* Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
