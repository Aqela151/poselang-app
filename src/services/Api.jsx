import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { Accept: "application/json" },
});

// Tempelkan token Sanctum ke setiap request, kalau ada.
// Key "pos_token" harus sama persis dengan yang dipakai saat login (lihat Login.jsx).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pos_token");
  // Debug: tampilkan apakah token ada dan apakah cookie akan dikirim
  try {
    // gunakan console.debug supaya mudah difilter di devtools
    console.debug("[api.request] pos_token present:", !!token, "withCredentials:", config.withCredentials);
  } catch (e) {}
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau backend balas 401 (token invalid/expired), bersihkan sesi lokal
// biar user tidak "nyangkut" di halaman yang butuh login tapi tokennya sudah mati.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Debug error response for easier diagnosis
    try {
      console.debug("[api.response.error]", error.response?.status, error.response?.data, error.config?.url);
    } catch (e) {}
    if (error.response?.status === 401) {
      localStorage.removeItem("pos_token");
      localStorage.removeItem("pos_user");
      // Redirect ke login. Pakai window.location karena file ini di luar konteks router.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;