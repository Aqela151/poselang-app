import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kasir from "./pages/Kasir";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Halaman login: tidak boleh diakses jika sudah login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Halaman khusus admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Halaman khusus kasir */}
        <Route
          path="/kasir"
          element={
            <ProtectedRoute allowedRoles={["kasir"]}>
              <Kasir />
            </ProtectedRoute>
          }
        />

        {/* Default: arahkan ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;