import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";
import StokBarang from "./pages/StokBarang";
import DataMember from "./pages/DataMember";
import Laporan from "./pages/Laporan";
import Settings from "./pages/Settings";

function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    const normalizedRole = user?.role?.toLowerCase?.() || "";
    return <Navigate to={normalizedRole === "admin" ? "/dashboard" : "/kasir"} replace />;
  }

  return <Navigate to="/login" replace />;
}

function LogoutRedirect() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    localStorage.removeItem("pos_token");
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/logout" element={<LogoutRedirect />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/kasir"
          element={
            <ProtectedRoute allowedRoles={["admin", "kasir"]}>
              <AppLayout>
                <Kasir />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stok-barang"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppLayout>
                <StokBarang />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-member"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppLayout>
                <DataMember />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/laporan"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppLayout>
                <Laporan />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "kasir"]}>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;