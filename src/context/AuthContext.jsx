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
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Data corrupt, bersihkan
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  // Dipanggil setelah login berhasil
  const login = (userData) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  // Dipanggil saat logout
  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isKasir: user?.role === "kasir",
    loading,
    login,
    logout,
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