import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Contoh tombol Logout, bisa dipakai di Navbar/Sidebar
 * pada halaman Dashboard maupun Kasir.
 */
export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Menghapus user dari localStorage & state
    localStorage.removeItem("pos_token"); // Hapus token jika ada
    navigate("/login", { replace: true });
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}