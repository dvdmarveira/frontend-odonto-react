import { Link, useLocation, useNavigate } from "react-router-dom";
import peridentalLogo from "../assets/imgs/logo/peridentalLogo.svg";
import {
  Question,
  UserCircle,
  Gauge,
  PresentationChart,
  Briefcase,
  Users,
  Archive,
  UsersThree,
} from "@phosphor-icons/react";
import { useAuth } from "../contexts/useAuth";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, hasPermission } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/users")) return "GESTÃO DE ACESSO";
    if (path.includes("/profile")) return "MEU PERFIL";
    if (path.match(/\/cases\/\d+/)) return "CASO DETALHADO";
    if (path === "/cases/add") return "NOVOS CASOS";
    if (path === "/dashboard/novo") return "DASHBOARD DE GRÁFICOS";
    if (path === "/dashboard") return "VISÃO GERAL";
    if (path === "/patients") return "CONSULTA DE PACIENTES";
    if (path === "/evidences") return "CONSULTA DE EVIDÊNCIAS";
    return "GESTÃO ODONTO-LEGAL";
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const NavLink = ({ to, icon, text }) => {
    const isActive = location.pathname === to;
    return (
      <li
        className={`border-b border-gray-200 py-2 ${
          isActive ? "bg-blue-50" : ""
        }`}
      >
        <Link
          to={to}
          className={`flex items-center gap-3 px-2 py-1 transition-colors duration-200 ${
            isActive
              ? "text-blue_secondary font-medium"
              : "text-gray_primary hover:text-blue_secondary"
          }`}
        >
          {icon}
          <span>{text}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue_quaternary text-white py-2 px-6 flex justify-between items-center shadow-md z-10">
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
        <div className="flex items-center gap-4">
          <Question
            size={28}
            className="text-white hover:text-blue-200 cursor-pointer"
          />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
          <div>
            <div className="flex justify-between items-center mb-4">
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:opacity-80"
              >
                <UserCircle size={32} className="text-gray_primary" />
                <div>
                  <p className="font-medium text-gray_primary">{user?.name}</p>
                  <p className="text-sm text-gray_primary capitalize">
                    {user?.role}
                  </p>
                </div>
              </Link>
              <button
                className="text-sm text-red_secondary font-medium hover:underline"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </div>
          <nav className="mt-4 flex-1">
            <ul className="space-y-1">
              <NavLink
                to="/dashboard"
                icon={<Gauge size={20} />}
                text="Visão Geral"
              />
              <NavLink
                to="/dashboard/novo"
                icon={<PresentationChart size={20} />}
                text="Dashboard"
              />

              {hasPermission("view_cases") && (
                <NavLink
                  to="/cases"
                  icon={<Briefcase size={20} />}
                  text="Gestão de Casos"
                />
              )}

              <NavLink
                to="/patients"
                icon={<Users size={20} />}
                text="Consultar Pacientes"
              />
              <NavLink
                to="/evidences"
                icon={<Archive size={20} />}
                text="Consultar Evidências"
              />

              {hasPermission("manage_users") && (
                <NavLink
                  to="/admin/users"
                  icon={<UsersThree size={20} />}
                  text="Gestão de Acesso"
                />
              )}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 flex flex-col bg-[#fbfbfb]">
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
