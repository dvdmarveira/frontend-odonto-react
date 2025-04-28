import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import Layout from "../components/Layout";

// Páginas públicas
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Componentes temporários para páginas ainda não implementadas
const ForgotPassword = () => (
  <div className="p-6">Página de Recuperação de Senha</div>
);
const ResetPassword = () => (
  <div className="p-6">Página de Redefinição de Senha</div>
);
const Profile = () => <div className="p-6">Página de Perfil</div>;
const EvidenceDetail = () => <div className="p-6">Detalhe da Evidência</div>;
const EvidenceForm = () => <div className="p-6">Formulário de Evidência</div>;
const ReportDetail = () => <div className="p-6">Detalhe do Laudo</div>;
const ReportForm = () => <div className="p-6">Formulário de Laudo</div>;
const DentalRecords = () => <div className="p-6">Registros Odontológicos</div>;
const DentalRecordDetail = () => (
  <div className="p-6">Detalhe do Registro Odontológico</div>
);
const DentalRecordForm = () => (
  <div className="p-6">Formulário de Registro Odontológico</div>
);
const DentalRecordComparison = () => (
  <div className="p-6">Comparação de Registros Odontológicos</div>
);

// Páginas protegidas
import Dashboard from "../pages/Dashboard";

// Casos
import Cases from "../pages/cases/Cases";
import CaseDetail from "../pages/cases/CaseDetail";
import AddCase from "../pages/cases/AddCase";

// Evidências
import Evidences from "../pages/evidences/Evidences";

// Laudos
import Reports from "../pages/reports/Reports";

// Admin
import Users from "../pages/users/AdminUsers";
import UserForm from "../pages/users/UserManagDetail";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  console.log(user, isAuthenticated);

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
      {/* Rotas Públicas */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Rotas Protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
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

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
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
        path="/cases/:id"
        element={
          <ProtectedRoute>
            <CaseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:id/edit"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <AddCase />
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
      <Route
        path="/evidences/new"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <EvidenceForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evidences/:id"
        element={
          <ProtectedRoute>
            <EvidenceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evidences/:id/edit"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <EvidenceForm />
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
      <Route
        path="/reports/new"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <ReportForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute>
            <ReportDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/:id/edit"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <ReportForm />
          </ProtectedRoute>
        }
      />

      {/* Registros Odontológicos */}
      <Route
        path="/dental-records"
        element={
          <ProtectedRoute>
            <DentalRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dental-records/new"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <DentalRecordForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dental-records/:id"
        element={
          <ProtectedRoute>
            <DentalRecordDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dental-records/:id/edit"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <DentalRecordForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dental-records/compare"
        element={
          <ProtectedRoute roles={["admin", "perito"]}>
            <DentalRecordComparison />
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

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
