import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * - Jika belum login -> redirect ke /login
 * - Jika allowedRoles diisi dan role user tidak sesuai -> redirect ke halaman defaultnya masing-masing role
 *
 * Contoh pemakaian di App.jsx:
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute allowedRoles={["admin"]}>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const normalizedRole = user?.role?.toLowerCase();

  // Tunggu proses cek localStorage selesai dulu
  if (loading) {
    return null; // atau tampilkan spinner full page jika mau
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak diizinkan untuk halaman ini, lempar ke halaman sesuai rolenya
  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    const redirectPath = normalizedRole === "admin" ? "/dashboard" : "/kasir";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

/**
 * PublicRoute
 * Dipakai khusus untuk halaman /login.
 * Jika user SUDAH login, tidak boleh kembali ke halaman login,
 * otomatis diarahkan ke halaman sesuai rolenya.
 */
export function PublicRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    const redirectPath = user.role === "admin" ? "/dashboard" : "/kasir";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}