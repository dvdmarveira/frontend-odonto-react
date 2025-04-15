import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import AddCase from "./pages/AddCase";
import Evidences from "./pages/Evidences";
import Reports from "./pages/Reports";
import AdminUsers from "./pages/AdminUsers";
import UserManagDetail from "./pages/UserManagDetail";
import ActivityDetail from "./pages/ActivityDetail";
import NotFound from "./pages/NotFound";
import "./assets/styles/index.css";

function App() {
  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  // Componente de rota protegida
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/add" element={<AddCase />} />
          <Route path="cases/:caseId" element={<CaseDetail />} />
          <Route path="evidences" element={<Evidences />} />
          <Route path="reports" element={<Reports />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/users/:userId" element={<UserManagDetail />} />
          <Route
            path="admin/users/:userId/activity/:activityId"
            element={<ActivityDetail />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
