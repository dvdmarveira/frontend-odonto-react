import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import Layout from "../components/Layout";

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
import Patients from "../pages/patients/Patients";
import Evidences from "../pages/evidences/Evidences";
import Reports from "../pages/reports/Reports";
import Users from "../pages/users/AdminUsers";
import UserForm from "../pages/users/UserManagDetail";

// Componente para proteger rotas
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
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
          <ProtectedRoute roles={["admin", "perito"]}>
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

      {/* --- ROTA DE EDIÇÃO ADICIONADA AQUI --- */}
      <Route
        path="/cases/:caseId/edit"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <AddCase />
          </ProtectedRoute>
        }
      />

      {/* Pacientes */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />

      {/* Evidências */}
      <Route
        path="/evidences"
        element={
          <ProtectedRoute>
            <Evidences />
          </ProtectedRoute>
        }
      />

      {/* Laudos */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
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
