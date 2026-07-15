import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "pos_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading saat cek localStorage pertama kali

  // Cek status login setiap kali aplikasi dibuka / direfresh
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ ...parsed, role: parsed.role?.toLowerCase() });
      } catch (error) {
        // Data corrupt, bersihkan
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  // Dipanggil setelah login berhasil
  const login = (userData) => {
    const normalizedUser = { ...userData, role: userData.role?.toLowerCase() };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  // Dipanggil saat logout
  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  // Dipanggil setelah user mengedit profil (mis. di halaman Settings)
  // supaya data user di seluruh app (avatar, nama, dsb) langsung ikut update
  // tanpa perlu logout/login ulang. Menerima objek partial, digabung dengan user lama.
  const updateUser = (partialData) => {
    setUser((prev) => {
      const updated = { ...prev, ...partialData };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isKasir: user?.role === "kasir",
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook agar mudah dipakai di komponen lain
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}