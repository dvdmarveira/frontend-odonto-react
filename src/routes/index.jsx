import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast"; // 1. Importar o toast

// --- PÁGINAS PÚBLICAS ---
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
// Componentes temporários
const ForgotPassword = () => (
  <div className="p-6">Página de Recuperação de Senha</div>
);
const ResetPassword = () => (
  <div className="p-6">Página de Redefinição de Senha</div>
);

// --- PÁGINAS PROTEGIDAS ---
import Dashboard from "../pages/Dashboard";
import Cases from "../pages/cases/Cases";
import CaseDetail from "../pages/cases/CaseDetail";
import AddCase from "../pages/cases/AddCase";
import Users from "../pages/users/AdminUsers";
import UserForm from "../pages/users/UserForm";

// Componente para proteger rotas
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. LÓGICA ATUALIZADA AQUI
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Exibe o aviso de erro antes de redirecionar
    toast.error("Você não tem permissão para acessar esta página.");
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* --- Rotas Protegidas --- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Casos */}
      <Route
        path="/cases"
        element={
          <ProtectedRoute>
            <Cases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/add"
        element={
          <ProtectedRoute roles={["admin", "perito", "assistente"]}>
            <AddCase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:caseId"
        element={
          <ProtectedRoute>
            <CaseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:caseId/edit"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <AddCase />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/new"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id/edit"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserForm />
          </ProtectedRoute>
        }
      />

      {/* Rota "Pega-Tudo" para página não encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
